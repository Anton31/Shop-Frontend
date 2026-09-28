import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ItemDto} from "../dto/item-dto";
import {Cart} from "../model/cart";
import {Order} from "../model/order";


@Injectable({providedIn: 'root'})
export class OrderService {
  baseUrl: string = 'http://localhost:8080/cart';

  private http = inject(HttpClient);

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}`);
  }

  addItemToCart(dto: ItemDto): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, dto);
  }

  editItem(dto: ItemDto): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}`, dto);
  }

  removeItem(itemId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${itemId}`);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/order`);
  }

  addOrder(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/order`, data);
  }

  removeOrder(orderId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/order/${orderId}`);
  }
}
