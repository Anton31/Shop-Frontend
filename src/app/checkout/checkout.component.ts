import {Component, inject, OnInit} from '@angular/core';
import {OrderService} from "../service/order-service";
import {Cart} from "../model/cart";

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  cart!: Cart;
  displayedColumns: string[] = ['name', 'actions'];

  private orderService = inject(OrderService);

  ngOnInit(): void {
    this.orderService.getCart().subscribe(data => {
      this.cart = data;
    })
  }

}
