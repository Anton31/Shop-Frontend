import {Component, inject, OnInit} from '@angular/core';
import {ItemDto} from "../dto/item-dto";
import {OrderService} from "../service/order-service";
import {Cart} from "../model/cart";
import {Router} from "@angular/router";
import {DialogRef} from "@angular/cdk/dialog";


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

  private router = inject(Router);
  private orderService = inject(OrderService);
  private dialogRef = inject(DialogRef);

  constructor() {
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
    });
  }

  ngOnInit(): void {
    this.getCart();
  }
}

// export interface CartDialogData {
//   cart: Cart
// }


