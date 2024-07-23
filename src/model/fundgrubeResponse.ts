import {PostingDTO} from "./postingDTO";

export class FundgrubeResponse {
  categories!: object[];
  brands!: object[];
  outlets!: object[];
  prices!: object;
  text!: object[];
  postings!: PostingDTO[];
  morePostingsAvailable!: boolean;
}
