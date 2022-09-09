import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {
  cForm!: FormGroup;
  cAddForm: any;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.cForm = this.fb.group({
      name : ['', Validators.required],
      email : [''],
      phoneNumber: ['', Validators.required]
    })
  }

}
