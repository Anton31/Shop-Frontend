import {Component, OnDestroy, signal} from '@angular/core';
import {Product} from "../../model/product";
import {Type} from "../../model/type";
import {Brand} from "../../model/brand";
import {ProductService} from "../../service/product-service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AddProductComponent} from "../add-product/add-product.component";
import {DeleteProductComponent} from "../delete-product/delete-product.component";
import {Sort} from "@angular/material/sort";
import {OrderService} from "../../service/order-service";
import {ItemDto} from "../../dto/item-dto";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CartComponent} from "../../cart/cart.component";
import {OrderDto} from "../../dto/order-dto";
import {Cart} from "../../model/cart";
import {AuthService} from "../../service/auth-service";
import {map, Observable, Subscription} from "rxjs";


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: false
})
export class ProductListComponent implements OnDestroy {

  title = 'angularFrontend';
  products: Product[] = [];
  filterTypes: Type[] = [];
  filterBrands: Brand[] = [];
  selectedTypeId = signal(0);
  currentBrandId = 0;
  currentSort = 'name';
  currentDir = 'ASC';
  totalProducts = 0;
  itemDto!: ItemDto;
  displayedColumns: string[] = ['name', 'price', 'photo', 'type', 'brand', 'actions', 'cart'];
  cartProductIds!: number[];
  productForm!: FormGroup;
  totalPrice!: number;
  totalQuantity!: number;
  orderDto: OrderDto;
  cart!: Cart;
  isAdmin!: Observable<boolean>;
  isUser!: Observable<boolean>;
  productSubscription!: Subscription;
  typeSubscription!: Subscription;
  cartSubscription!: Subscription;

  constructor(private fb: FormBuilder,
              private productService: ProductService,
              private orderService: OrderService,
              private authService: AuthService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {

    this.itemDto = new ItemDto(0, 0, 0);
    this.orderDto = new OrderDto('', '', '');
    this.isAdmin = this.authService.userSubject.pipe(map(value => value.role === 'admin'));
    this.isUser = this.authService.userSubject.pipe(map(value => value.role === 'user'));
    this.getProducts();
    this.getFilterTypes();
    this.getCart();
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
    this.typeSubscription.unsubscribe();
    this.cartSubscription.unsubscribe();
  }

  getProducts() {
    this.productSubscription = this.productService.getProducts(this.selectedTypeId(), this.currentBrandId,
      this.currentSort, this.currentDir)
      .subscribe(data => {
        this.products = data.products;
        this.totalProducts = data.totalProducts;
      });
  }

  sortProducts(sortState: Sort) {
    this.currentSort = sortState.active;
    this.currentDir = sortState.direction;
    this.productService.getProducts(this.selectedTypeId(), this.currentBrandId,
      this.currentSort, this.currentDir)
      .subscribe(data => {
        this.products = data.products;
      });
  }

  getFilterTypes() {
    this.typeSubscription = this.productService.getProductTypes('id', 'ASC').subscribe(data => {
      this.filterTypes = data;
    });
  }

  getFilterBrands(typeId: number) {
    this.selectedTypeId.set(typeId);
    this.productService.getProductBrands(this.selectedTypeId(), 'id', 'ASC').subscribe(data => {
      if (this.selectedTypeId() > 0) {
        this.filterBrands = data;
      } else {
        this.filterBrands = [];
      }
    });
  }

  typeFilter(typeId: number) {
    if (typeId == this.selectedTypeId()) {
      this.selectedTypeId.set(0);
      this.currentBrandId = 0;
    } else {
      this.selectedTypeId.set(typeId);
      this.currentBrandId = 0;
    }
    this.getFilterBrands(this.selectedTypeId());
    this.productService.getProducts(this.selectedTypeId(), this.currentBrandId,
      this.currentSort, this.currentDir)
      .subscribe(data => {
        this.products = data.products;
        this.totalProducts = data.totalProducts;
      });
  }

  brandFilter(brandId: number) {
    if (this.currentBrandId == brandId) {
      this.currentBrandId = 0;
    } else {
      this.currentBrandId = brandId;
    }
    this.productService.getProducts(this.selectedTypeId(), this.currentBrandId,
      this.currentSort, this.currentDir)
      .subscribe(data => {
        this.products = data.products;
      });
  }

  addProduct() {
    this.productForm = this.fb.group({
      typeId: [1],
      brandId: [1],
      name: [''],
      price: [1000]
    })
    const dialogRef = this.dialog.open(AddProductComponent, {
      height: '600px',
      width: '600px',
      data: {
        productForm: this.productForm, new: true
      }
    }).afterClosed().subscribe(data => {
      this.productService.addProduct(data).subscribe(data => {
          this.resetFilters();
          this.getProducts();
          this.getFilterTypes();
        },
        error => {
          this.snackBar.open(error.error.message, '', {duration: 3000})
        }
      )
    });
  }

  editProduct(product: Product) {
    this.productForm = this.fb.group({
      id: [product.id],
      typeId: [product.type.id],
      brandId: [product.brand.id],
      name: [product.name],
      price: [product.price]
    })
    const dialogRef = this.dialog.open(AddProductComponent, {
      height: '600px',
      width: '600px',
      data: {productForm: this.productForm, new: false}
    }).afterClosed().subscribe(data => {
      this.productService.editProduct(data).subscribe(data => {
          this.resetFilters();
          this.getProducts();
          this.getFilterTypes();
        },
        error => {
          this.snackBar.open(error.error.message, '', {duration: 3000})
        });
    });
  }

  deleteProduct(product: Product) {
    this.dialog.open(DeleteProductComponent, {
      height: '600px',
      width: '600px',
      data: {
        product: product
      }
    }).afterClosed().subscribe(data => {
      this.productService.deleteProduct(data).subscribe(data => {
        this.getProducts();
        this.getFilterTypes();
        this.getFilterBrands(this.selectedTypeId());
      });
    });
  }

  resetFilters() {
    this.selectedTypeId.set(0);
    this.currentBrandId = 0;
  }

  getCart() {
    this.totalPrice = 0;
    this.cartProductIds = [];
    this.cartSubscription = this.orderService.getCart().subscribe(data => {
      this.cart = data;
      this.totalPrice = data.totalPrice;
      this.totalQuantity = data.totalQuantity;
      for (let i = 0; i < data.items.length; i++) {
        this.cartProductIds.push(data.items[i].product.id);
      }
    });
  }

  addItemToCart(productId: number) {
    this.itemDto.productId = productId;
    this.itemDto.itemId = 0;
    this.orderService.addItemToCart(this.itemDto).subscribe(data => {
      this.dialog.open(CartComponent, {
        height: '800px',
        width: '800px',
        data: {
          orderDto: this.orderDto,
          cart: data
        }
      }).afterClosed().subscribe(data => {
        this.getCart();
      });
      this.getCart();
    });
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
    });
    this.getCart();
  }
}
