import {Item} from "./item";
import {User} from "./user";

export class Cart {
  id: number;
  items: Item[] = [];
  user!: User;
  cartProductsIds: number[] = [];
  totalPrice: number;
  totalQuantity: number;


  constructor() {
    this.id = 0;
    this.totalPrice = 0;
    this.totalQuantity = 0;
  }
}
