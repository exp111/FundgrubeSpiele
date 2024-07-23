export interface PostingDTO {
  posting_id: string;
  posting_text: string;
  price: string;
  price_old: string;
  shipping_cost: number;
  shipping_type: string;
  discount_in_percent: number;
  name: string;
  brand: { id: number; name: string };
  eek: object;
  top_level_catalog_id: string;
  original_url: string[];
  outlet: object;
  pim_id: number;
}
