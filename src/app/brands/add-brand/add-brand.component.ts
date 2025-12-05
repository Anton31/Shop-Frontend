import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormGroup} from "@angular/forms";
import {ProductService} from "../../service/product-service";
import {Type} from "../../model/type";
import {Brand} from "../../model/brand";

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.css'],
  standalone: false
})
export class AddBrandComponent implements OnInit {
  title: string;
  types!: Type[];
  brands!: Brand[];

  constructor(private service: ProductService,
              public dialogRef: MatDialogRef<AddBrandComponent>,
              @Inject(MAT_DIALOG_DATA) public data: BrandDialogData
  ) {
    this.title = data.new ? 'Add brand' : 'Edit brand';

  }

  getTypes() {
    this.service.getAllTypes('id', 'ASC').subscribe(data => {
      this.types = data;
    })
  }

  getBrands() {
    this.service.getAllBrands('name', 'ASC').subscribe(data => {
      this.brands = data;
    })
  }

  onNoClick() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.getTypes();
    this.getBrands();
  }
}

export interface BrandDialogData {
  brandForm: FormGroup;
  new: boolean;
}
