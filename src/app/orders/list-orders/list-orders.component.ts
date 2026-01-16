import {Component, OnInit} from '@angular/core';
import {OrderService} from "../../service/order-service";
import {Order} from "../../model/order";

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.css'],
  standalone: false
})
export class ListOrdersComponent implements OnInit {
  order!: Order;
  displayedColumns: string[] = ['name', 'price', 'quantity', 'products', 'delete'];

  constructor(private orderService: OrderService) {
  }

  getOrders() {
    this.orderService.getOrders().subscribe(data => {
      this.order = data;
    })
  }

  deleteOrder(orderId: number) {
    this.orderService.removeOrder(orderId).subscribe(data => {
      this.getOrders();
    })
  }

  ngOnInit(): void {
    this.getOrders();
  }
}
