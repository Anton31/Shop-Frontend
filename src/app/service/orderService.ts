import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ItemDto} from "../dto/itemDto";
import {Cart} from "../model/cart";
import {Order} from "../model/order";
import {OrderDto} from "../dto/orderDto";

@Injectable()
export class OrderService {
  baseUrl: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.baseUrl + '/cart');
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl + '/cart/order');
  }

  addItemToCart(dto: ItemDto): Observable<Cart> {
    return this.http.post<Cart>(this.baseUrl + '/cart', dto);
  }

  addOrder(dto: OrderDto): Observable<Order> {
    return this.http.post<Order>(this.baseUrl + '/cart/order', dto);
  }

  editItem(dto: ItemDto): Observable<Cart> {
    return this.http.put<Cart>(this.baseUrl + '/cart', dto);
  }

  removeItem(itemId: number): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/cart?itemId=' + itemId);
  }
}
