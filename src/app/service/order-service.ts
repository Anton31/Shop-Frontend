import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ItemDto} from "../dto/item-dto";
import {Cart} from "../model/cart";
import {Order} from "../model/order";


@Injectable({providedIn: 'root'})
export class OrderService {
  baseUrl: string = 'http://localhost:8080';

  private http = inject(HttpClient);

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/cart`);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/cart/order`);
  }

  addItemToCart(dto: ItemDto): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/cart/add/${dto.productId}`);
  }

  addOrder(data: any): Observable<Order[]> {
    return this.http.post<Order[]>(`${this.baseUrl}/cart/order`, data);
  }

  editItem(dto: ItemDto): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/cart/edit/${dto.itemId}/${dto.quantity}`);
  }

  removeItem(itemId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/cart/delete/${itemId}`);
  }

  removeOrder(itemId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/cart/order/${itemId}`);
  }
}
