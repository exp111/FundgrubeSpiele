import {PostingDTO} from "./postingDTO";

export enum PostingSource {
  MediaMarkt,
  Saturn
}

export class Posting {
  source: PostingSource;
  name: string;
  brand: string;
  image: string;
  total: number;
  price: number;
  shippingCost: number;
  count: number;
  samePriceCount: number;

  constructor(dto: PostingDTO, source: PostingSource) {
    this.source = source;
    this.name = dto.name;
    this.brand = dto.brand.name;
    this.image = dto.original_url.length > 0 ? dto.original_url[0] : "";
    this.price = Number(dto.price);
    this.shippingCost = dto.shipping_cost;
    this.total = this.price + this.shippingCost;
    this.count = 1;
    this.samePriceCount = 1;
  }

  public updatePrice(other: Posting) {
    this.total = other.GetTotal();
    this.price = other.GetPrice();
    this.shippingCost = other.GetShippingCost();
    this.samePriceCount = 1;
  }
  public increaseCount() {
    this.count += 1;
  }

  public increaseSamePriceCount() {
    this.samePriceCount += 1;
  }

  public GetTotal() {
    return this.total;
  }
  public GetPrice() {
    return this.price;
  }
  public GetShippingCost() {
    return this.shippingCost;
  }
}
