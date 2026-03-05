import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Product} from "../../model/product";
import {Type} from "../../model/type";
import {Brand} from "../../model/brand";
import {ProductService} from "../../service/product-service";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AddProductComponent} from "../add-product/add-product.component";
import {DeleteProductComponent} from "../delete-product/delete-product.component";
import {MatSortModule, Sort} from "@angular/material/sort";
import {OrderService} from "../../service/order-service";
import {ItemDto} from "../../dto/item-dto";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Cart} from "../../model/cart";
import {map, Observable, Subscription} from "rxjs";
import {AuthService} from "../../service/auth-service";
import {CartComponent} from "../../cart/cart.component";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {AsyncPipe} from "@angular/common";
import {MatBadgeModule} from "@angular/material/badge";
import {RouterModule} from "@angular/router";
import {MatChipsModule} from "@angular/material/chips";


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [
    MatButtonModule,
    MatChipsModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatDialogModule,
    AsyncPipe,
    MatBadgeModule,
    RouterModule
  ]
})
export class ProductListComponent implements OnInit, OnDestroy {

  title = 'products';
  products: Product[] = [];
  filterTypes: Type[] = [];
  filterBrands: Brand[] = [];
  selectedTypeId = 0;
  selectedBrandId = 0;
  selectedSort = 'name';
  selectedDir = 'ASC';
  itemDto!: ItemDto;
  displayedColumns: string[] = [];
  cartProductIds: number[] = [];
  productForm!: FormGroup;
  totalQuantity = 0;
  cart!: Cart;
  isUser!: Observable<boolean>;
  isAdmin!: Observable<boolean>;
  showTypeFilter = true;
  productSubscription!: Subscription;
  typeSubscription!: Subscription;
  cartSubscription!: Subscription;

  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.itemDto = new ItemDto(0, 0, 0);
    this.displayedColumns = ['name', 'photo', 'price', 'type', 'brand', 'actions', 'cart'];

    this.isAdmin = this.authService.userSubject.pipe(map(data => data.role === 'admin'));
    this.isUser = this.authService.userSubject.pipe(map(data => data.role === 'user'));

    this.cartSubscription = this.authService.cartSubject.subscribe(data => {
      this.totalQuantity = data.totalQuantity;
      this.cartProductIds = data.cartProductsIds;
    });
  }

  ngOnInit(): void {
    this.getData();
    this.getCart();
  }

  getData() {
    this.getProducts();
    this.getProductTypes();
    this.getProductBrands(this.selectedTypeId);
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
    this.typeSubscription.unsubscribe();
    this.cartSubscription.unsubscribe();
  }

  getCart() {
    this.authService.getCart();
  }

  getProducts() {
    this.productSubscription = this.productService.getProducts(
      this.selectedTypeId, this.selectedBrandId, this.selectedSort, this.selectedDir)
      .subscribe(data => {
        this.products = data;
      })
  }

  sortProducts(sortState: Sort) {
    this.selectedSort = sortState.active;
    this.selectedDir = sortState.direction;
    this.getProducts();
  }

  getProductTypes() {
    this.showTypeFilter = false;
    this.typeSubscription = this.productService.getProductTypes('name', 'ASC')
      .subscribe(data => {
        this.filterTypes = data;
        this.showTypeFilter = true;
      });
  }

  getProductBrands(typeId: number) {
    this.selectedTypeId = typeId;
    this.productService.getProductBrands(this.selectedTypeId, 'name', 'ASC')
      .subscribe(data => {
        this.filterBrands = data;
      });
  }

  filterByType(typeId: number) {
    if (typeId === this.selectedTypeId) {
      this.selectedTypeId = 0;
      this.selectedBrandId = 0;
    } else {
      this.selectedTypeId = typeId;
      this.selectedBrandId = 0;
    }
    this.getProductBrands(this.selectedTypeId);
    this.getProducts();
  }

  filterByTypeBrand(brandId: number) {
    if (brandId === this.selectedBrandId) {
      this.selectedBrandId = 0;
    } else {
      this.selectedBrandId = brandId;
    }
    this.getProducts();
  }

  addProduct() {
    this.productForm = this.fb.group({
      typeId: [1],
      brandId: [1],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      price: [1000]
    });

    this.dialog.open(AddProductComponent, {
      minWidth: '600px',
      height: '600px',
      data: {
        productForm: this.productForm, new: true
      }
    }).afterClosed().subscribe(data => {
      if (data) {
        this.productService.addProduct(data).subscribe({
          next: () => {
            this.reset();
            this.getData();
          }, error: (error) => {
            this.snackBar.open(error.error.message, '', {duration: 3000})
          }
        });
      }
    });
  }

  editProduct(product: Product) {
    this.productForm = this.fb.group({
      id: [product.id],
      typeId: [product.type.id],
      brandId: [product.brand.id],
      name: [product.name, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      price: [product.price]
    })

    this.dialog.open(AddProductComponent, {
      minWidth: '600px',
      height: '600px',
      data: {productForm: this.productForm, new: false}
    }).afterClosed().subscribe(data => {
      if (data) {
        this.productService.editProduct(data).subscribe({
          next: () => {
            this.reset();
            this.getData();
          }, error: (error) => {
            this.snackBar.open(error.error.message, '', {duration: 3000})
          }
        });
      }
    });
  }

  deleteProduct(product: Product) {
    this.dialog.open(DeleteProductComponent, {
      minWidth: '600px',
      height: '600px',
      data: {
        product: product
      }
    }).afterClosed().subscribe(data => {
      if (data) {
        this.productService.deleteProduct(data).subscribe({
          next: () => {
            this.reset();
            this.getData();
          }, error: (error) => {
            this.snackBar.open(error.error.message, '', {duration: 3000})
          }
        });
      }
    });
  }

  reset() {
    this.selectedTypeId = 0;
    this.selectedBrandId = 0;
  }

  addItemToCart(product: Product) {
    this.itemDto.productId = product.id;
    this.itemDto.itemId = 0;
    this.orderService.addItemToCart(this.itemDto).subscribe(() => {
      this.snackBar.open(product.name + ' added to cart', '', {duration: 3000});
      this.getCart();
    });
  }

  openCart() {
    this.dialog.open(CartComponent, {
      maxWidth: '800px',
      minWidth: '800px',
      height: '800px',
    }).afterClosed().subscribe(() => {
      this.getCart();
    });
  }
}
