import {Product} from "../model/product";

export interface ResponseProductDto {
  products: Product[];
  pageSize: number;
  currentPage: number;
  totalProducts: number;
}
