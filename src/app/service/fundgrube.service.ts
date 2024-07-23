import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {FundgrubeResponse} from "../../model/fundgrubeResponse";
import {PostingDTO} from "../../model/postingDTO";
import {brandBlacklist} from "./brandBlacklist";
import {Posting} from "../../model/posting";

@Injectable({
  providedIn: 'root'
})
export class FundgrubeService {
  private LIMIT = 99;
  private MMLink = "https://www.mediamarkt.de/de/data/fundgrube/api/postings?limit=0&offset=0&orderBy=new&categorieIds=CAT_DE_MM_8007";
  private SaturnLink = "https://www.saturn.de/de/data/fundgrube/api/postings?limit=0&offset=0&orderBy=new&recentFilter=categories&categorieIds=CAT_DE_SAT_2492";

  constructor(public http: HttpClient) {
  }

  private getUrl(url: string, count: number, offset: number) {
    return url.replace("limit=0", `limit=${count}`).replace("offset=0", `offset=${offset}`);
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

  private async getPostings(url: string) {
    const postings = [];
    let offset = 0;
    let moreAvailable = true;
    do {
      const res = await firstValueFrom(this.http.get<FundgrubeResponse>(this.getUrl(url, this.LIMIT, offset)));
      postings.push(...res.postings);
      moreAvailable = res.morePostingsAvailable;
      offset += this.LIMIT;
    } while (moreAvailable);
    return postings;
  }

  private filterPostings(postings: PostingDTO[]) {
    let dict: { [key: string]: Posting } = {};
    for (const posting of postings) {
      let name = posting.GetName();
      let brand = posting.GetBrandName();
      if (brand in brandBlacklist) {
        continue;
      }

      if (dict[name]) {
        const obj = dict[name];
        const curTotal = posting.GetTotal();
        const objTotal = obj.GetTotal();
        obj.increaseCount();
        if (objTotal > curTotal) {
          obj.updatePrice(posting);
        } else if (objTotal == curTotal) {
          obj.increaseSamePriceCount();
        }
      } else {
        dict[name] = new Posting(posting);
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
