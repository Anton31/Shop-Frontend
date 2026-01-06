import {Component, Inject} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ProductService} from "../../service/product-service";
import {Product} from "../../model/product";
import {FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Observable} from "rxjs";

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
    nav: true
  }

  product!: Product;
  title = '';
  photoForm!: FormGroup;
  isAdmin!: Observable<boolean>;


  constructor(private productService: ProductService,
              private dialogRef: MatDialogRef<GetProductComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CarouselDialogData) {
    this.product = data.product;


  }

  // getProducts(id: number) {
  //   this.productService.getProduct(id).subscribe(data => {
  //     this.product = data;
  //     this.title = data.name;
  //   });
  //
  // }

  // addPhotos(product: Product) {
  //   this.photoForm = this.fb.group({
  //     productId: [product.id],
  //     photos: [null]
  //   });
  //   this.dialog.open(AddPhotosComponent, {
  //     height: '500px',
  //     width: '500px',
  //     data: {
  //       photoForm: this.photoForm,
  //       product: product
  //     }
  //   }).afterClosed().subscribe(data => {
  //     this.productService.addPhotos(data).subscribe(data => {
  //       this.productService.getProduct(data).subscribe(data => {
  //         this.product = data;
  //       })
  //     })
  //   })
  // }
  //
  // deletePhotos(product: Product) {
  //   this.dialog.open(DeletePhotosComponent, {
  //     height: '500px',
  //     width: '500px',
  //     data: {
  //       product: product
  //     }
  //   }).afterClosed().subscribe(data => {
  //     this.productService.deletePhotos(data).subscribe(data => {
  //       this.productService.getProduct(data).subscribe(data => {
  //         this.product = data;
  //       })
  //     });
  //   });
  // }
  //
  // deletePhoto(product: Product, photo: Photo) {
  //   this.dialog.open(DeletePhotoComponent, {
  //     height: '500px',
  //     width: '500px',
  //     data: {
  //       photo: photo
  //     }
  //   }).afterClosed().subscribe(data => {
  //     this.productService.deletePhoto(product.id, data.id).subscribe(data => {
  //       this.productService.getProduct(data).subscribe(data => {
  //         this.product = data;
  //       })
  //     });
  //   });
  // }

  setItems(value: number) {
    this.customOptions = {
      items: value,
      loop: true,
      autoplay: true,
      nav: true
    }
  }

  protected onNoClick() {
    this.dialogRef.close();
  }
}

export interface CarouselDialogData {
  product: Product;
}
