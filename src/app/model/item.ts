import {Product} from "./product";

export interface Item {
  id: number;
  product: Product;
  quantity: number;
  totalPrice: number;
}
