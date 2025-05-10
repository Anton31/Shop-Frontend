import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

import {Type} from "../model/type";
import {Brand} from "../model/brand";
import {ResponseProductDto} from "../dto/ResponseProductDto";

@Injectable()
export class ProductService {
  fileArray!: File[];
  baseUrl: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  setFiles(file: FileList) {
    this.fileArray = Array.from(file);
  }

  deleteFiles() {
    this.fileArray = [];
  }

  getAllTypes(dir: string | undefined,
              sort: string | undefined): Observable<Type[]> {
    let params = new HttpParams();
    params = dir == undefined ? params : params.set('dir', dir);
    params = sort == undefined ? params : params.set('sort', sort);
    return this.http.get<Type[]>(`${this.baseUrl}/products/type`, {params: params});
  }

  getProductTypes(): Observable<Type[]> {
    return this.http.get<Type[]>(`${this.baseUrl}/products/productType`);
  }
  getAllBrands(typeId: number, dir: string | undefined,
               sort: string | undefined): Observable<Brand[]> {
    let params = new HttpParams();
    params = params.set('typeId', typeId);
    params = dir == undefined ? params : params.set('dir', dir);
    params = sort == undefined ? params : params.set('sort', sort);
    return this.http.get<Brand[]>(`${this.baseUrl}/products/brand`, {params: params});
  }
  getProducts(typeId: number, brandId: number,
              sort: string | undefined, dir: string | undefined,
              page: number | undefined, size: number | undefined): Observable<ResponseProductDto> {
    let params = new HttpParams();
    params = sort == undefined ? params : params.set('sort', sort);
    params = dir == undefined ? params : params.set('dir', dir);
    params = params.set('typeId', typeId);
    params = params.set('brandId', brandId);
    params = page == undefined ? params : params.set('page', page);
    params = size == undefined ? params : params.set('size', size);
    return this.http.get<ResponseProductDto>(`${this.baseUrl}/products/product`, {params: params});
  }

  addProduct(data: any): Observable<any> {
    const formData = new FormData();
    if (data.controls.typeId.value > 0) {
      formData.append("typeId", data.controls.typeId.value);
    }
    if (data.controls.brandId.value > 0) {
      formData.append("brandId", data.controls.brandId.value);
    }
    formData.append("name", data.controls.name.value);
    formData.append("price", data.controls.price.value);
    return this.http.post<any>(`${this.baseUrl}/products/product`, formData);
  }

  editProduct(data: any): Observable<any> {
    const formData = new FormData();
    formData.append("id", data.controls.id.value);
    if (data.controls.typeId.value > 0) {
      formData.append("typeId", data.controls.typeId.value);
    }
    if (data.controls.brandId.value > 0) {
      formData.append("brandId", data.controls.brandId.value);
    }
    formData.append("name", data.controls.name.value);
    formData.append("price", data.controls.price.value);
    return this.http.put<any>(`${this.baseUrl}/products/product`, formData);
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/products/product/${productId}`);
  }

  addType(data: any): Observable<any> {
    const formData = new FormData();
    formData.append("name", data.controls.name.value);
    return this.http.post<any>(`${this.baseUrl}/products/type`, formData);
  }

  editType(data: any): Observable<any> {
    const formData = new FormData();
    formData.append("id", data.controls.id.value);
    formData.append("name", data.controls.name.value);
    return this.http.put<any>(`${this.baseUrl}/products/type`, formData);
  }

  deleteType(typeId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/products/type/${typeId}`);
  }

  addBrand(data: any): Observable<any> {
    const formData = new FormData();
    formData.append("name", data.controls.name.value);
    return this.http.post<any>(`${this.baseUrl}/products/brand`, formData);
  }

  editBrand(data: any): Observable<any> {
    const formData = new FormData();
    formData.append("id", data.controls.id.value);
    formData.append("name", data.controls.name.value);
    return this.http.put<any>(`${this.baseUrl}/products/brand`, formData);
  }

  deleteBrand(brandId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/products/brand/${brandId}`);
  }

  addPhoto(data: any): Observable<any> {
    const formData = new FormData();
    formData.append('productId', data.controls.productId.value);
    for (let i = 0; i < this.fileArray.length; i++) {
      formData.append('photos', this.fileArray[i]);
    }
    this.deleteFiles();
    return this.http.post<any>(`${this.baseUrl}/products/photo`, formData);
  }

  deletePhoto(photoId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/products/photo/${photoId}`);
  }
}
