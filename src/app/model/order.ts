import {Item} from "./item";
import {User} from "./user";

export interface Order {
  id: number;
  name: string;
  user: User;
  totalPrice: number;
  totalQuantity: number;
  items: Item[];
}
