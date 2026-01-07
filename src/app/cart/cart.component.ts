import {Component, Inject, OnInit} from '@angular/core';
import {ItemDto} from "../dto/item-dto";
import {OrderService} from "../service/order-service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

import {Cart} from "../model/cart";

import {FormBuilder, FormGroup} from "@angular/forms";


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: false
})
export class CartComponent implements OnInit {
  title = 'Cart';
  itemDto!: ItemDto;
  displayedColumns: string[] = ['name', 'actions'];
  cart!: Cart;
  orderForm!: FormGroup;

  constructor(private orderService: OrderService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<CartComponent>,
              @Inject(MAT_DIALOG_DATA) public data: AddItemDialog) {
    this.itemDto = new ItemDto(0, 0, 0);


  }

  getCart() {
    this.orderService.getCart().subscribe(data => {
      this.cart = data;
    });
  }

  plusItem(itemId: number) {
    this.itemDto.quantity = 1;
    this.itemDto.itemId = itemId;
    this.orderService.editItem(this.itemDto).subscribe(data => {
      this.getCart();
    });
  }

  minusItem(itemId: number) {
    this.itemDto.quantity = -1;
    this.itemDto.itemId = itemId;
    this.orderService.editItem(this.itemDto).subscribe(data => {
      this.getCart();
    });
  }

  addOrder() {
    this.orderForm = this.fb.group({
      description: [''],
      username: [this.cart.user.username],
      email: [this.cart.user.email]
    })
    this.orderService.addOrder(this.orderForm).subscribe(data => {
      this.dialogRef.close();

    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

  removeFromCart(id: number) {
    this.orderService.removeItem(id).subscribe(data => {
      this.getCart();
    })
  }

  ngOnInit(): void {
    this.getCart();
  }
}

export interface AddItemDialog {
  cart: Cart;
}
