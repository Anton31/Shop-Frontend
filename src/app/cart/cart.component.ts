import {Component, Inject, OnInit} from '@angular/core';
import {ItemDto} from "../dto/item-dto";
import {OrderService} from "../service/order-service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {Cart} from "../model/cart";
import {AuthService} from "../service/auth-service";


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

  constructor(private orderService: OrderService,
              private authService: AuthService,
              private router: Router,
              private dialogRef: MatDialogRef<CartComponent>,
              @Inject(MAT_DIALOG_DATA) public data: AddItemDialog) {
    this.itemDto = new ItemDto(0, 0, 0);
    this.authService.cartSubject.subscribe(data=>{
      this.cart = data;
    })

  }

  getCart() {
    this.authService.getCart();
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

  checkout() {
    this.dialogRef.close();
    this.router.navigate(['checkout']);
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
