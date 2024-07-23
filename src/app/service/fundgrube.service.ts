import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {FundgrubeResponse} from "../model/fundgrubeResponse";
import {PostingDTO} from "../model/postingDTO";
import {brandBlacklist} from "../data/brandBlacklist";
import {Posting} from "../model/posting";

@Injectable({
  providedIn: 'root'
})
export class FundgrubeService {
  private CORS_PROXY = "https://corsproxy.io/?";
  private FETCH_DELAY = 200;
  private LIMIT = 99;
  private MMLink = "https://www.mediamarkt.de/de/data/fundgrube/api/postings?limit=0&offset=0&orderBy=new&categorieIds=CAT_DE_MM_8007";
  private SaturnLink = "https://www.saturn.de/de/data/fundgrube/api/postings?limit=0&offset=0&orderBy=new&recentFilter=categories&categorieIds=CAT_DE_SAT_2492";

  constructor(public http: HttpClient) {
  }

  private corsProxy(url: string) {
    return `${this.CORS_PROXY}${encodeURIComponent(url)}`;
  }

  private getUrl(url: string, count: number, offset: number) {
    return this.corsProxy(url.replace("limit=0", `limit=${count}`).replace("offset=0", `offset=${offset}`));
  }

  public GetMM() {
    return this.Get(this.MMLink);
  }

  public GetSaturn() {
    return this.Get(this.SaturnLink);
  }

  public GetAll() {
    return Promise.all([this.GetMM(), this.GetSaturn()])
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  private async getPostings(url: string) {
    const postings = [];
    let offset = 0;
    let moreAvailable = true;
    do {
      const res = await firstValueFrom(this.http.get<FundgrubeResponse>(this.getUrl(url, this.LIMIT, offset)));
      postings.push(...res.postings);
      moreAvailable = res.morePostingsAvailable;
      offset += this.LIMIT;
      await this.delay(this.FETCH_DELAY);
    } while (moreAvailable);
    return postings;
  }

  private filterPostings(postings: PostingDTO[]) {
    let dict: { [key: string]: Posting } = {};
    for (const posting of postings) {
      let cur = new Posting(posting);
      if (cur.brand in brandBlacklist) {
        continue;
      }

      if (dict[cur.name]) {
        const obj = dict[cur.name];
        const curTotal = cur.total;
        const objTotal = obj.GetTotal();
        obj.increaseCount();
        if (objTotal > curTotal) {
          obj.updatePrice(cur);
        } else if (objTotal == curTotal) {
          obj.increaseSamePriceCount();
        }
      } else {
        dict[cur.name] = cur;
      }
    }
    return Object.values(dict);
  }

  private async Get(url: string) {
    console.log(`Fetching from ${url}`);
    const postings = await this.getPostings(url);
    return this.filterPostings(postings);
  }
}
