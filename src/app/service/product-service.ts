import {HttpClient, HttpParams, httpResource} from "@angular/common/http";
import {inject, Injectable, Signal} from "@angular/core";
import {Observable} from "rxjs";

import {Type} from "../model/type";
import {Brand} from "../model/brand";
import {Product} from "../model/product";

@Injectable({providedIn: 'root'})
export class ProductService {

  fileArray!: File[];
  baseUrl: string = 'http://localhost:8080';

  private http = inject(HttpClient);

  setFiles(file: FileList) {
    this.fileArray = Array.from(file);
  }

  deleteFiles() {
    this.fileArray = [];
  }

  getProducts(typeId: Signal<number>, brandId: Signal<number>, sort: Signal<string>, dir: Signal<string>) {
    return httpResource(() => `${this.baseUrl}/products/product?typeId=
    ${typeId()}&brandId=${brandId()}&sort=${sort()}&dir=${dir()}`);
  }

  getAllTypes(sort: string, dir: string): Observable<Type[]> {
    let params = new HttpParams();
    params = params.set('sort', sort);
    params = params.set('dir', dir);
    return this.http.get<Type[]>(`${this.baseUrl}/products/type`, {params: params});
  }

  getAllBrands(sort: string, dir: string): Observable<Brand[]> {
    let params = new HttpParams();
    params = params.set('sort', sort);
    params = params.set('dir', dir);
    return this.http.get<Brand[]>(`${this.baseUrl}/products/brand`, {params: params});
  }

  getProductTypes(sort: string, dir: string): Observable<Type[]> {
    let params = new HttpParams();
    params = params.set('sort', sort);
    params = params.set('dir', dir);
    return this.http.get<Type[]>(`${this.baseUrl}/products/productType`, {params: params});
  }

  getProductBrands(typeId: Signal<number>) {
    return httpResource(() => `${this.baseUrl}/products/productBrand?typeId=${typeId()}`);
  }


  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/product/${id}`);
  }

  addProduct(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/products/product`, data);
  }

  editProduct(data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/products/product`, data);
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/products/product/${productId}`);
  }

  addType(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/products/type`, data);
  }

  editType(data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/products/type`, data);
  }

  deleteType(typeId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/products/type/${typeId}`);
  }

  addBrand(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/products/brand`, data);
  }

  editBrand(data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/products/brand`, data);
  }

  deleteBrand(brandId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/products/brand/${brandId}`);
  }

  addPhotos(data: any) {
    const formData = new FormData();
    formData.append('productId', data.controls.productId.value);
    for (let i = 0; i < this.fileArray.length; i++) {
      formData.append('photos', this.fileArray[i]);
    }
    this.deleteFiles();
    return this.http.post<any>(`${this.baseUrl}/products/photo`, formData)
  }

  deletePhotos(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/products/photo/${productId}`);
  }

  deletePhoto(productId: number, photoId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/products/photo/${productId}/${photoId}`);
  }
}
