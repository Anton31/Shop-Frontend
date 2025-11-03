import {Component} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ProductService} from "../../service/product-service";
import {Product} from "../../model/product";
import {ActivatedRoute} from "@angular/router";
import {AddPhotosComponent} from "../../photos/add-photos/add-photos.component";
import {DeletePhotosComponent} from "../../photos/delete-photos/delete-photos.component";
import {Photo} from "../../model/photo";
import {DeletePhotoComponent} from "../../photos/delete-photo/delete-photo.component";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {UserInfo} from "../../dto/user-info";
import {UserService} from "../../service/user-service";

@Component({
  selector: 'app-get-product',
  standalone: false,
  templateUrl: './get-product.component.html',
  styleUrl: './get-product.component.css'
})
export class GetProductComponent {
  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    items: 2,
    nav: true
  }
  product!: Product;
  productId: string | null = null;
  title = '';
  photoForm!: FormGroup;
  user!: Observable<UserInfo>;

  constructor(private productService: ProductService,
              private userService: UserService,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private route: ActivatedRoute) {
    this.user = this.userService.userSubject.pipe();
    this.route.params.subscribe(params => {
      this.productId = params['id'];
    });
    this.productService.getProduct(Number(this.productId)).subscribe(data => {
      this.product = data;
      this.title = data.name;
    });
  }

  addPhotos(product: Product) {
    this.photoForm = this.fb.group({
      productId: [product.id],
      photos: [null]
    });
    this.dialog.open(AddPhotosComponent, {
      height: '500px',
      width: '500px',
      data: {
        photoForm: this.photoForm,
        product: product
      }
    }).afterClosed().subscribe(data => {
      this.productService.addPhotos(data).subscribe(data => {
        this.productService.getProduct(data).subscribe(data=>{
          this.product = data;
        })

      })
    })
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
        this.productService.getProduct(data).subscribe(data=>{
          this.product = data;
        })
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
        this.productService.getProduct(data).subscribe(data=>{
          this.product = data;
        })
      });
    });
  }
}
