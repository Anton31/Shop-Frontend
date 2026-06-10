import {Component, inject, OnDestroy, OnInit, Signal} from '@angular/core';
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
  products: Product[] = [];
  filterTypes: Type[] = [];
  filterBrands: Brand[] = [];
  selectedTypeId = 0;
  selectedBrandId = 0;
  selectedSort = 'name';
  selectedDir = 'ASC';
  itemDto!: ItemDto;
  displayedColumns: string[] = [];
  productForm!: FormGroup;

  cart!: Signal<Cart>;
  isUser!: Signal<boolean>;
  isAdmin!: Signal<boolean>;

  productSubscription!: Subscription;
  typeSubscription!: Subscription;


  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.itemDto = new ItemDto(0, 0, 0);
    this.displayedColumns = ['name', 'photo', 'price', 'type', 'brand', 'actions', 'cart'];

    this.isAdmin = toSignal(this.authService.userSubject
      .pipe(map(data => data.role === 'admin')), {initialValue: false});

    this.isUser = toSignal(this.authService.userSubject
      .pipe(map(data => data.role === 'user')), {initialValue: false});

    this.cart = this.authService.cart;

  }

  ngOnInit(): void {
    this.getProducts();
    this.getProductTypes();
    this.getCart();
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
    this.typeSubscription.unsubscribe();
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
    this.typeSubscription = this.productService.getProductTypes('name', 'ASC')
      .subscribe(data => {
        this.filterTypes = data;
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
    this.selectedTypeId = 0;
    this.selectedBrandId = 0;
    this.getProducts();
    this.getProductTypes();
    this.getProductBrands(this.selectedTypeId);
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
