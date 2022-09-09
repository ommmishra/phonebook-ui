import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


export interface DialogData {
        name: string;
        phone_number: string;
        email: string;
      
}

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {

  eForm!: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.eForm = this.fb.group({
      name : ['', Validators.required],
      email : [''],
      phoneNumber: ['', Validators.required]
    })
  }

}
