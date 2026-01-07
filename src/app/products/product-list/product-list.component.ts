import {Component, OnDestroy, OnInit, signal} from '@angular/core';
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
import {Router} from "@angular/router";


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: false
})
export class ProductListComponent implements OnInit, OnDestroy {

  title = 'angularFrontend';
  products: Product[] = [];
  filterTypes: Type[] = [];
  filterBrands: Brand[] = [];
  selectedTypeId = signal(0);
  selectedBrandId = signal(0);
  selectedSort = signal('name');
  selectedDir = signal('ASC');
  itemDto!: ItemDto;
  displayedColumns: string[] = ['name', 'price', 'photo', 'type', 'brand', 'actions', 'cart'];
  cartProductIds: number[] = [];
  productForm!: FormGroup;
  totalQuantity = signal(0);
  orderDto: OrderDto;
  cart!: Cart;
  photoForm!: FormGroup;
  isAdmin!: Observable<boolean>;
  isUser!: Observable<boolean>;
  productSubscription!: Subscription;
  typeSubscription!: Subscription;
  cartSubscription!: Subscription;

  constructor(private fb: FormBuilder,
              private router: Router,
              private productService: ProductService,
              private orderService: OrderService,
              private authService: AuthService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
    this.itemDto = new ItemDto(0, 0, 0);
    this.orderDto = new OrderDto('', '', '');
    this.isAdmin = this.authService.userSubject.pipe(map(user => user.role === 'admin'));
    this.isUser = this.authService.userSubject.pipe(map(user => user.role === 'user'));
    this.authService.userSubject.pipe();
    this.authService.cartSubject.subscribe(data => {
      this.cartProductIds = data.cartProductsIds;
      this.totalQuantity.set(data.totalQuantity);
    })

  }

  ngOnInit(): void {
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
    this.productSubscription = this.productService.getProducts(
      this.selectedTypeId(),
      this.selectedBrandId(),
      this.selectedSort(),
      this.selectedDir())
      .subscribe(data => {
        this.products = data;
      })
  }

  sortProducts(sortState: Sort) {
    this.selectedSort.set(sortState.active);
    this.selectedDir.set(sortState.direction);
    this.productService.getProducts(
      this.selectedTypeId(),
      this.selectedBrandId(),
      this.selectedSort(),
      this.selectedDir())
      .subscribe(data => {
        this.products = data;
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
      this.selectedBrandId.set(0);
    } else {
      this.selectedTypeId.set(typeId);
      this.selectedBrandId.set(0);
    }
    this.getFilterBrands(this.selectedTypeId());
    this.productService.getProducts(
      this.selectedTypeId(),
      this.selectedBrandId(),
      this.selectedSort(),
      this.selectedDir())
      .subscribe(data => {
        this.products = data;
      });
  }

  brandFilter(brandId: number) {
    if (this.selectedBrandId() === brandId) {
      this.selectedBrandId.set(0);
    } else {
      this.selectedBrandId.set(brandId);
    }
    this.productService.getProducts(
      this.selectedTypeId(),
      this.selectedBrandId(),
      this.selectedSort(),
      this.selectedDir())
      .subscribe(data => {
        this.products = data;
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
    this.selectedBrandId.set(0);
    this.selectedSort.set('name');
    this.selectedDir.set('ASC');
  }

  getCart() {
    this.orderService.getCart().subscribe(data => {
      this.authService.getCart();
    })
  }

  addItemToCart(product: Product) {
    this.itemDto.productId = product.id;
    this.itemDto.itemId = 0;
    this.orderService.addItemToCart(this.itemDto).subscribe(data => {
      this.snackBar.open(product.name + ' added to cart', '', {duration: 2000});
      this.getCart();
    });
  }

  openCart() {
    this.dialog.open(CartComponent, {
      height: '600px',
      width: '600px'
    }).afterClosed().subscribe(data => {
      this.getCart();
    });
  }
}
