import {PostingDTO} from "./postingDTO";

export class Posting {
  name: string;
  brand: string;
  image: string;
  total: number;
  price: number;
  shippingCost: number;
  count: number;
  samePriceCount: number;

  constructor(dto: PostingDTO) {
    this.name = dto.GetName();
    this.brand = dto.GetBrandName();
    this.image = dto.GetImage();
    this.price = dto.GetPrice();
    this.shippingCost = dto.GetShippingCost();
    this.total = dto.GetTotal();
    this.count = 1;
    this.samePriceCount = 1;
  }

  public updatePrice(dto: PostingDTO) {
    this.total = dto.GetTotal();
    this.price = dto.GetPrice();
    this.shippingCost = dto.GetShippingCost();
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
}
