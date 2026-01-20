import {Component, inject, OnInit} from '@angular/core';
import {OrderService} from "../service/order-service";
import {Cart} from "../model/cart";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  cart!: Cart;
  displayedColumns: string[] = ['name', 'actions'];
  orderForm!: FormGroup;

  private orderService = inject(OrderService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);


  ngOnInit(): void {
    this.getCart();
  }

  getCart() {
    this.orderService.getCart().subscribe(data => {
      this.cart = data;
      this.orderForm = this.fb.group({
        name: ['']
      });
    })
  }

  openCart() {
    this.router.navigate(['cart']);
  }

  addOrder(data: any) {
    this.orderService.addOrder(data).subscribe(data => {
      this.router.navigate(['orders']);
    })
  }
}
