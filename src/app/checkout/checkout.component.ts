import {Component, OnInit} from '@angular/core';
import {OrderService} from "../service/order-service";
import {Cart} from "../model/cart";
import {OrderDto} from "../dto/orderDto";
import {MatDialog} from "@angular/material/dialog";
import {CartComponent} from "../cart/cart.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: false
})
export class CheckoutComponent implements OnInit {
  cart!: Cart;
  orderDto: OrderDto;
  displayedColumns: string[] = ['name', 'photo', 'actions'];

  constructor(private orderService: OrderService,
              private dialog: MatDialog,
              private router: Router) {
    this.orderDto = new OrderDto('', '', '');
  }

  getCart() {
    this.orderService.getCart().subscribe(data => {
      this.cart = data;
      this.orderDto.username = data.user.username;
      this.orderDto.email = data.user.email;
    })
  }

  openCart() {
    this.dialog.open(CartComponent, {
      height: '800px',
      width: '800px',
      data: {
        orderDto: this.orderDto,
        cart: this.cart
      }
    }).afterClosed().subscribe(data => {
      this.getCart();
      this.router.navigate(['checkout']);
    });
    this.getCart();
  }

  addOrder() {
    this.orderService.addOrder(this.orderDto).subscribe(data => {
      this.router.navigate(['orders']);
    });
  }

  ngOnInit(): void {
    this.getCart();
  }
}
