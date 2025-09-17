import {Item} from "./item";
import {User} from "./user";

export interface Cart {
  id: number;
  user: User;
  items: Item[];
  totalPrice: number;
  totalQuantity: number;
}
