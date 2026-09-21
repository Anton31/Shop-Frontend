import {ChangeDetectionStrategy, Component, inject, signal, Signal} from '@angular/core';
import {Product} from "../../model/product";
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
import {map} from "rxjs";
import {AuthService} from "../../service/auth-service";
import {CartComponent} from "../../cart/cart.component";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatBadgeModule} from "@angular/material/badge";
import {RouterModule} from "@angular/router";
import {MatChipsModule} from "@angular/material/chips";
import {toSignal} from "@angular/core/rxjs-interop";
import {HttpResourceRef} from "@angular/common/http";


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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {

  products!: HttpResourceRef<any>;
  filterTypes!: HttpResourceRef<any>;
  filterBrands!: HttpResourceRef<any>;

  selectedTypeId = signal<number>(0);
  selectedBrandId = signal<number>(0);
  selectedSort = signal('name');
  selectedDir = signal('ASC');

  itemDto!: ItemDto;
  displayedColumns = signal(['']);
  productForm!: FormGroup;

  cart!: Signal<Cart>;
  isUser!: Signal<boolean>;
  isAdmin!: Signal<boolean>;

  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.products = this.productService.getProducts(
      this.selectedTypeId, this.selectedBrandId, this.selectedSort, this.selectedDir);
    this.filterTypes = this.productService.getProductTypes();
    this.filterBrands = this.productService.getProductBrands(this.selectedTypeId);

    this.itemDto = new ItemDto(0, 0, 0);

    this.displayedColumns.set(['name', 'photo', 'price', 'type', 'brand', 'actions', 'cart']);

    this.isAdmin = toSignal(this.authService.userSubject
      .pipe(map(data => data.role === 'admin')), {initialValue: false});

    this.isUser = toSignal(this.authService.userSubject
      .pipe(map(data => data.role === 'user')), {initialValue: false});

    this.cart = this.authService.cart;

  }

  getCart() {
    this.authService.getCart();
  }

  sortProducts(sortState: Sort) {
    this.selectedSort.set(sortState.active);
    this.selectedDir.set(sortState.direction);
  }

  getProductBrands(typeId: number) {
    this.selectedTypeId.set(typeId);
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
      typeId: [1],
      brandId: [1],
      name: ['', [Validators.required, Validators.minLength(3)]],
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
      name: [product.name, [Validators.required, Validators.minLength(3)]],
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
          }, error: (error) => {
            this.snackBar.open(error.error.message, '', {duration: 3000})
          }
        });
      }
    });
  }

  reset() {
    if (this.selectedTypeId() > 0) {
      this.selectedTypeId.set(0);
      this.selectedBrandId.set(0);
    } else {
      this.products.reload();
    }
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


