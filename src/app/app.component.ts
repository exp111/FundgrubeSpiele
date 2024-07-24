import {Component, Inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Posting, PostingSource} from "./model/posting";
import {FundgrubeService} from "./service/fundgrube.service";
import {NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";

enum SortBy {
  None,
  Name,
  Price,
  Brand
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgForOf, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'FundgrubeSpiele';
  allPostings: Posting[] = [];
  filteredPostings: Posting[] = [];
  //TODO: use observe function for filter
  searchFilter: string = "";
  sortBy: SortBy = SortBy.None;
  ascendingSort: boolean = true;
  showMM: boolean = true;
  showSaturn: boolean = true;

  constructor(public fundgrubeService: FundgrubeService) {
    (window as any).app = this;
  }

  ngOnInit(): void {
    console.log("Starting app...");
    Promise.all([
      this.fundgrubeService.GetMM().then(postings => this.allPostings.push(...postings)),
      this.fundgrubeService.GetSaturn().then(postings => this.allPostings.push(...postings))
    ])
      .then(() => {
        this.filter();
      })
  }

  // gets the entries of an enum, ignoring any inbuilt non number enusm
  enumEntries(en: any) {
    return Object.entries(en).filter(e => isNaN(e[0] as any))
  }

  filter() {
    this.filteredPostings = this.allPostings.filter(p => {
      if (!this.showMM && p.source == PostingSource.MediaMarkt) {
        return false;
      }
      if (!this.showSaturn && p.source == PostingSource.Saturn) {
        return false;
      }

      if (!p.name.toLowerCase().includes(this.searchFilter.toLowerCase())) {
        return false;
      }
      return true;
    })
      .sort((a, b) => {
        let first = this.ascendingSort ? a : b;
        let other = this.ascendingSort ? b : a;
        // we have to cast to number because the select sets it to it
        switch (Number(this.sortBy)) {
          case Number(SortBy.None):
            return 0;
          case Number(SortBy.Name):
            return first.name.localeCompare(other.name, undefined, {sensitivity: "base"});
          case Number(SortBy.Price):
            return first.price - other.price;
          case Number(SortBy.Brand):
            return first.brand.localeCompare(other.brand, undefined, {sensitivity: "base"});
        }
        throw new Error(`Unknown sort type: ${this.sortBy}`);
      });
  }

  onSourceChecked(event: any, source: PostingSource) {
    let checked = event.target.checked;
    this.filteredPostings = this.allPostings.filter(p => p.source != source || (checked && p.source == source));
  }

  onSearch(event: any) {
    const search = event.target.value.toLowerCase();
    this.filteredPostings = this.allPostings.filter(p => p.name.toLowerCase().includes(search));
  }

  GetPostingCountOfSource(source: PostingSource) {
    return this.filteredPostings.filter(p => p.source == source).length;
  }

  protected readonly PostingSource = PostingSource;
  protected readonly SortBy = SortBy;
}
