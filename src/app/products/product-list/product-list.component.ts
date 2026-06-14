import {Component, inject, OnDestroy, OnInit, signal, Signal} from '@angular/core';
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
import {map, Subscription} from "rxjs";
import {AuthService} from "../../service/auth-service";
import {CartComponent} from "../../cart/cart.component";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatBadgeModule} from "@angular/material/badge";
import {RouterModule} from "@angular/router";
import {MatChipsModule} from "@angular/material/chips";
import {toSignal} from "@angular/core/rxjs-interop";
import {httpResource, HttpResourceRef} from "@angular/common/http";


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
    MatBadgeModule,
    RouterModule
  ]
})
export class ProductListComponent implements OnInit, OnDestroy {

  title = 'products';
  products: HttpResourceRef<any>;
  filterTypes: Type[] = [];
  filterBrands: Brand[] = [];

  selectedTypeId = signal(0);
  selectedBrandId = signal(0);
  selectedSort = signal('name');
  selectedDir = signal('ASC');

  itemDto!: ItemDto;
  displayedColumns: string[] = [];
  productForm!: FormGroup;

  cart!: Signal<Cart>;
  isUser!: Signal<boolean>;
  isAdmin!: Signal<boolean>;

  typeSubscription!: Subscription;


  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.products = httpResource(() => `http://localhost:8080/products/product?typeId=
    ${this.selectedTypeId()}&brandId=${this.selectedBrandId()}&sort=${this.selectedSort()}&dir=${this.selectedDir()}`);

    this.itemDto = new ItemDto(0, 0, 0);
    this.displayedColumns = ['name', 'photo', 'price', 'type', 'brand', 'actions', 'cart'];

    this.isAdmin = toSignal(this.authService.userSubject
      .pipe(map(data => data.role === 'admin')), {initialValue: false});

    this.isUser = toSignal(this.authService.userSubject
      .pipe(map(data => data.role === 'user')), {initialValue: false});

    this.cart = this.authService.cart;

  }

  ngOnInit(): void {
    this.getProductTypes();
    this.getCart();
  }

  ngOnDestroy(): void {
    this.typeSubscription.unsubscribe();
  }

  getCart() {
    this.authService.getCart();
  }

  sortProducts(sortState: Sort) {
    this.selectedSort.set(sortState.active);
    this.selectedDir.set(sortState.direction);
  }

  getProductTypes() {
    this.typeSubscription = this.productService.getProductTypes('name', 'ASC')
      .subscribe(data => {
        this.filterTypes = data;
      });
  }

  getProductBrands(typeId: number) {
    this.selectedTypeId.set(typeId);
    this.productService.getProductBrands(this.selectedTypeId(), 'name', 'ASC')
      .subscribe(data => {
        this.filterBrands = data;
      });
  }

  filterByType(typeId: number) {
    if (typeId === this.selectedTypeId()) {
      this.selectedTypeId.set(0);
      this.selectedBrandId.set(0);
    } else {
      this.selectedTypeId.set(typeId);
      this.selectedBrandId.set(0);
    }
    this.getProductBrands(this.selectedTypeId());
  }

  filterByTypeBrand(brandId: number) {
    if (brandId === this.selectedBrandId()) {
      this.selectedBrandId.set(0);
    } else {
      this.selectedBrandId.set(brandId);
    }
  }

  addProduct() {
    this.productForm = this.fb.group({
      typeId: [0],
      brandId: [0],
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
            this.products.reload();
          }, error: (error) => {
            this.snackBar.open(error.error.message, '', {duration: 3000})
          }
        });
      }
    });
  }

  editProduct(product: Product) {
    let typeId = 0;
    let brandId = 0;
    if (product.type !== null) {
      typeId = product.type.id
    }
    if (product.brand !== null) {
      brandId = product.brand.id
    }
    this.productForm = this.fb.group({
      id: [product.id],
      typeId: [typeId],
      brandId: [brandId],
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
            this.products.reload();
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
            this.products.reload();
          }, error: (error) => {
            this.snackBar.open(error.error.message, '', {duration: 3000})
          }
        });
      }
    });
  }

  reset() {
    this.selectedTypeId.set(0);
    this.selectedBrandId.set(0);
    this.selectedSort.set('name');
    this.selectedDir.set('ASC');
    this.getProductTypes();
    this.getProductBrands(this.selectedTypeId());
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
