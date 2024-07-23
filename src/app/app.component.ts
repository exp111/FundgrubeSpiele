import {Component, Inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Posting} from "./model/posting";
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
  postings: Posting[] = [];

  constructor(public fundgrubeService: FundgrubeService) {
  }

  ngOnInit(): void {
    console.log("Starting app...");
    this.fundgrubeService.GetMM().then(postings => this.postings = postings);
  }
}
