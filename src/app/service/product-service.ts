import {HttpClient, httpResource} from "@angular/common/http";
import {inject, Injectable, Signal} from "@angular/core";
import {Observable} from "rxjs";
import {Product} from "../model/product";

@Injectable({providedIn: 'root'})
export class ProductService {

  fileArray!: File[];
  baseUrl: string = 'http://localhost:8080/products';

  private http = inject(HttpClient);

  setFiles(file: FileList) {
    this.fileArray = Array.from(file);
  }

  deleteFiles() {
    this.fileArray = [];
  }

  getProducts(typeId: Signal<string>, brandId: Signal<string>,
              sort: Signal<string>, dir: Signal<string>) {
    return httpResource(() => `${this.baseUrl}/product?typeId=
    ${typeId()}&brandId=${brandId()}&sort=${sort()}&dir=${dir()}`);
  }

  getAllTypes(sort: Signal<string>, dir: Signal<string>) {
    return httpResource(() => `${this.baseUrl}/type?sort=${sort()}&dir=${dir()}`);
  }

  getAllBrands(sort: Signal<string>, dir: Signal<string>) {
    return httpResource(() => `${this.baseUrl}/brand?sort=${sort()}&dir=${dir()}`);
  }

  getProductTypes() {
    return httpResource(() => `${this.baseUrl}/productType`);
  }

  getProductBrands(typeId: Signal<string>) {
    return httpResource(() => `${this.baseUrl}/productBrand?typeId=${typeId()}`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/product/${id}`);
  }

  addProduct(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/product`, data);
  }

  editProduct(data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/product`, data);
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/product/${productId}`);
  }

  addType(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/type`, data);
  }

  editType(data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/type`, data);
  }

  deleteType(typeId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/type/${typeId}`);
  }

  addBrand(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/brand`, data);
  }

  editBrand(data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/brand`, data);
  }

  deleteBrand(brandId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/brand/${brandId}`);
  }

  addPhotos(data: any) {
    const formData = new FormData();
    formData.append('productId', data.controls.productId.value);
    for (let i = 0; i < this.fileArray.length; i++) {
      formData.append('photos', this.fileArray[i]);
    }
    this.deleteFiles();
    return this.http.post<any>(`${this.baseUrl}/photo`, formData)
  }

  deletePhotos(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/photo/${productId}`);
  }

  deletePhoto(productId: number, photoId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/photo/${productId}/${photoId}`);
  }
}
