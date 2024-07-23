export class PostingDTO {
  posting_id!: string;
  posting_text!: string;
  price!: string;
  price_old!: string;
  shipping_cost!: number;
  shipping_type!: string;
  discount_in_percent!: number;
  name!: string;
  brand!: { id: number; name: string };
  eek!: object;
  top_level_catalog_id!: string;
  original_url!: string[];
  outlet!: object;
  pim_id!: number;

  public GetName() {
    return this.name;
  }
  public GetBrandName() {
    return this.brand.name;
  }

  public GetTotal() {
    return this.GetPrice() + this.GetShippingCost();
  }

  public GetImage() {
    return this.original_url.length > 0 ? this.original_url[0] : "";
  }

  public GetPrice() {
    return Number(this.price);
  }

  public GetShippingCost() {
    return this.shipping_cost;
  }
}
