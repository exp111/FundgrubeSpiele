import {Component, Inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Posting, PostingSource} from "./model/posting";
import {FundgrubeService} from "./service/fundgrube.service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgForOf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'FundgrubeSpiele';
  allPostings: Posting[] = [];
  filteredPostings: Posting[] = [];

  constructor(public fundgrubeService: FundgrubeService) {
  }

  ngOnInit(): void {
    console.log("Starting app...");
    Promise.all([
      this.fundgrubeService.GetMM().then(postings => this.allPostings.push(...postings)),
      this.fundgrubeService.GetSaturn().then(postings => this.allPostings.push(...postings))
    ])
      .then(() => {
        this.filteredPostings = [...this.allPostings];
      })
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
}
