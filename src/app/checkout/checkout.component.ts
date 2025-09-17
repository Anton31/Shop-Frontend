import {Component, OnInit} from '@angular/core';
import {OrderService} from "../service/order-service";
import {Cart} from "../model/cart";
import {MatDialog} from "@angular/material/dialog";
import {CartComponent} from "../cart/cart.component";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: false
})
export class CheckoutComponent implements OnInit {
  cart!: Cart;
  orderForm!: FormGroup;
  displayedColumns: string[] = ['name', 'actions'];

  constructor(private orderService: OrderService,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private router: Router) {

  }

  getCart() {
    this.orderService.getCart().subscribe(data => {
      this.cart = data;
      this.orderForm = this.fb.group({
        description: [''],
        username: [data.user.username],
        email: [data.user.email]
      })
    })
  }

  openCart() {
    this.dialog.open(CartComponent, {
      height: '800px',
      width: '800px',
      data: {
        cart: this.cart
      }
    }).afterClosed().subscribe(data => {
      this.getCart();
      this.router.navigate(['checkout']);
    });
    this.getCart();
  }

  addOrder() {
    this.orderService.addOrder(this.orderForm).subscribe(data => {
      this.router.navigate(['orders']);
    });
  }

  ngOnInit(): void {
    this.getCart();
  }
}


