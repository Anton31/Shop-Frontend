import {Component, Inject, OnInit} from '@angular/core';
import {ProductService} from "../../service/productService";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormGroup} from "@angular/forms";
import {Type} from "../../model/type";

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.css'],
  standalone: false
})
export class AddBrandComponent implements OnInit {
  title: string;
  types: Type[] = [];


  constructor(public service: ProductService,
              public dialogRef: MatDialogRef<AddBrandComponent>,
              @Inject(MAT_DIALOG_DATA) public data: BrandDialogData
  ) {
    this.title = data.new ? 'Add brand' : 'Edit brand';

  }

  getTypes() {
    this.service.getAllTypes(undefined, undefined).subscribe(data => {
      this.types = data;
    })
  }

  onNoClick() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.getTypes();
  }
}

export interface BrandDialogData {
  brandForm: FormGroup;
  new: boolean;
}
