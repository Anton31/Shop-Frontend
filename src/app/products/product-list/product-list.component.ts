import {Component, OnInit} from '@angular/core';
import {Product} from "../../model/product";
import {Type} from "../../model/type";
import {Brand} from "../../model/brand";
import {ProductService} from "../../service/product-service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AddProductComponent} from "../add-product/add-product.component";
import {PageEvent} from "@angular/material/paginator";
import {DeleteProductComponent} from "../delete-product/delete-product.component";
import {Sort} from "@angular/material/sort";
import {OrderService} from "../../service/order-service";
import {ItemDto} from "../../dto/itemDto";
import {UserService} from "../../service/user-service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AddPhotoComponent} from "../../photos/add-photo/add-photo.component";
import {DeletePhotosComponent} from "../../photos/delete-photos/delete-photos.component";
import {CartComponent} from "../../cart/cart.component";
import {OrderDto} from "../../dto/orderDto";
import {Cart} from "../../model/cart";
import {Observable} from "rxjs";
import {UserInfo} from "../../dto/user-info";
import {DeletePhotoComponent} from "../../photos/delete-photo/delete-photo.component";
import {Photo} from "../../model/photo";


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: false
})
export class ProductListComponent implements OnInit {
  title = 'angularFrontend';
  products: Product[] = [];
  filterTypes: Type[] = [];
  filterBrands: Brand[] = [];
  currentTypeId = 0;
  currentBrandId = 0;
  currentSort: string | undefined = undefined;
  currentDir: string | undefined = undefined;
  pageSize: number | undefined = undefined;
  pageIndex: number | undefined = undefined;
  totalProducts = 0;
  pageSizeOptions = [2, 5, 10];
  itemDto!: ItemDto;
  displayedColumns: string[] = ['name', 'price', 'photo', 'type', 'brand', 'actions', 'cart'];
  cartProductIds!: number[];
  photoForm!: FormGroup;
  productForm!: FormGroup;
  totalPrice!: number;
  totalQuantity!: number;
  orderDto: OrderDto;
  cart!: Cart;
  user!: Observable<UserInfo>;

  constructor(private fb: FormBuilder,
              private productService: ProductService,
              private orderService: OrderService,
              private userService: UserService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
    this.itemDto = new ItemDto(0, 0, 0);
    this.orderDto = new OrderDto('', '', '');
    this.user = this.userService.userSubject.pipe();
  }

  sortProducts(sortState: Sort) {
    this.currentSort = sortState.active;
    this.currentDir = sortState.direction;
    this.productService.getProducts(this.currentTypeId, this.currentBrandId,
      this.currentSort, this.currentDir, this.pageIndex, this.pageSize)
      .subscribe(data => {
        this.products = data.products;
        this.pageSize = data.pageSize;
      });
  }

  getFilterTypes() {
    this.productService.getProductTypes().subscribe(data => {
      this.filterTypes = data;
    });
  }

  getFilterBrands(typeId: number) {
    this.currentTypeId = typeId;
    this.productService.getAllBrandsByTypeId(this.currentTypeId, 'id', undefined).subscribe(data => {
      if (this.currentTypeId > 0) {
        this.filterBrands = data;
      } else {
        this.filterBrands = [];
      }
    });
  }

  typeFilter(typeId: number) {
    if (typeId == this.currentTypeId) {
      this.currentTypeId = 0;
      this.currentBrandId = 0;
    } else {
      this.currentTypeId = typeId;
      this.currentBrandId = 0;
    }
    this.getFilterBrands(this.currentTypeId);
    this.productService.getProducts(this.currentTypeId, this.currentBrandId,
      this.currentSort, this.currentDir, undefined, undefined)
      .subscribe(data => {
        this.products = data.products;
        this.totalProducts = data.totalProducts;
        this.pageSize = data.pageSize;
        this.pageIndex = data.currentPage;
      });
  }

  brandFilter(brandId: number) {
    if (this.currentBrandId == brandId) {
      this.currentBrandId = 0;
    } else {
      this.currentBrandId = brandId;
    }
    this.productService.getProducts(this.currentTypeId, this.currentBrandId,
      this.currentSort, this.currentDir, undefined, undefined)
      .subscribe(data => {
        this.products = data.products;
        this.pageSize = data.pageSize;
        this.totalProducts = data.totalProducts;
        this.pageIndex = data.currentPage;
      });
  }

  getProducts() {
    this.productService.getProducts(this.currentTypeId, this.currentBrandId,
      this.currentSort, this.currentDir, this.pageIndex, this.pageSize)
      .subscribe(data => {
        this.products = data.products;
        this.pageSize = data.pageSize;
        this.pageIndex = data.currentPage;
        this.totalProducts = data.totalProducts;
      });
  }

  pageChangeEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.productService.getProducts(this.currentTypeId, this.currentBrandId,
      this.currentSort, this.currentDir, this.pageIndex, this.pageSize)
      .subscribe(data => {
        this.products = data.products;
        this.pageSize = data.pageSize;
        this.pageIndex = data.currentPage;
        this.totalProducts = data.totalProducts;
      });
  }

  addPhoto(productId: number) {
    this.photoForm = this.fb.group({
      productId: [productId],
      photo: [null]
    });
    const dialogRef = this.dialog.open(AddPhotoComponent, {
      height: '500px',
      width: '500px',
      data: {
        photoForm: this.photoForm
      }
    }).afterClosed().subscribe(data => {
      this.productService.addPhoto(data).subscribe(data => {
          this.getProducts();
          this.resetFilters();
        },
        error => {
          this.snackBar.open(error.error.message, '', {duration: 3000})
        }
      )
    });
  }

  addProduct() {
    this.productForm = this.fb.group({
      id: [undefined],
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
    let typeId = 0;
    if (product.type != null) {
      typeId = product.type.id;
    }
    let brandId = 0;
    if (product.brand != null) {
      brandId = product.brand.id;
    }
    this.productForm = this.fb.group({
      id: [product.id],
      typeId: [typeId],
      brandId: [brandId],
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
        this.resetFilters();
        this.getProducts();
        this.getFilterTypes();
      });
    });
  }

  resetFilters() {
    this.currentTypeId = 0;
    this.currentBrandId = 0;
    this.currentSort = undefined;
    this.currentDir = undefined;
    this.pageIndex = undefined;
    this.pageSize = undefined;
  }

  deletePhotos(product: Product) {
    this.dialog.open(DeletePhotosComponent, {
      height: '500px',
      width: '500px',
      data: {
        product: product
      }
    }).afterClosed().subscribe(data => {
      this.productService.deletePhotos(data).subscribe(data => {
        this.getProducts();
        this.resetFilters();
      });
    });
  }

  deletePhoto(product: Product, photo: Photo) {
    this.dialog.open(DeletePhotoComponent, {
      height: '500px',
      width: '500px',
      data: {
        photo: photo
      }
    }).afterClosed().subscribe(data => {
      this.productService.deletePhoto(product.id, data.id).subscribe(data => {
        this.getProducts();
        this.resetFilters();
      });
    });
  }

  getCart() {
    this.totalPrice = 0;
    this.cartProductIds = [];
    this.orderService.getCart().subscribe(data => {
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

  ngOnInit(): void {
    this.getProducts();
    this.getFilterTypes();
    this.getCart();
  }
}
