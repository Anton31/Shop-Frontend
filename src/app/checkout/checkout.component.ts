import {Component, inject, OnInit} from '@angular/core';
import {OrderService} from "../service/order-service";
import {Cart} from "../model/cart";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {CartComponent} from "../cart/cart.component";

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  cart!: Cart;
  private service = inject(OrderService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.getCart();
  }

  getCart() {
    this.service.getCart().subscribe(data => {
      this.cart = data;
    })
  }

  openCart() {
    this.dialog.open(CartComponent, {
      maxWidth: '1000px',
      minWidth: '1000px',
      height: '800px'
    }).afterClosed().subscribe(data=>{
      this.getCart();
    });
  }

  addOrder() {
    this.service.addOrder().subscribe(data => {
      this.router.navigate(['orders']);
    })
  }
}
