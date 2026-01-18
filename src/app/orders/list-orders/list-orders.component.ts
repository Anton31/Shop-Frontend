import {Component, inject, OnInit} from '@angular/core';
import {OrderService} from "../../service/order-service";
import {Order} from "../../model/order";

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.css'],
  standalone: false
})
export class ListOrdersComponent implements OnInit {
  orders: Order[] = [];
  displayedColumns: string[] = ['name', 'price', 'quantity', 'photo', 'delete'];

  private orderService = inject(OrderService);

  getOrders() {
    this.orderService.getOrders().subscribe(data => {
      this.orders = data;
    })
  }

  deleteOrder(itemId: number) {
    this.orderService.removeOrder(itemId).subscribe(() => {
      this.getOrders();
    })
  }

  ngOnInit(): void {
    this.getOrders();
  }
}
