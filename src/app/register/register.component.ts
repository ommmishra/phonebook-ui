import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  rForm!: FormGroup;
  errorMessage!: string | null;
  successMessage!: string | null;
  registerForm: any;
  constructor(private fb: FormBuilder, private router: Router, private snack: MatSnackBar, private rService: RegisterService) { }

  ngOnInit(): void {
    // this.rForm = this.fb.group({
    //   userName : ['', Validators.required, Validators.pattern(/^[A-z]+(?:[\s.]+[A-z]+)*$/)],
    //   email : ['', Validators.required, Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{3,5})$/)],
    //   password: ['', Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*]).{7,20}$/)]
    // })
    this.checkIfLoggedIn()
    this.rForm = this.fb.group({
      userName : ['', Validators.required],
      email : ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  checkIfLoggedIn(): void {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if(userId && token){
      this.router.navigate(['/contacts']);
    }
  }

  userRegister(){
    this.errorMessage = null;
    this.successMessage = null;

    this.registerForm = {
      userName: this.rForm.value.userName,
      email: this.rForm.value.email,
      password: this.rForm.value.password
    }
    this.rService.register(this.registerForm).subscribe(
      (response) => {
        console.log('Register Response',response);
        if(response) {
          localStorage.setItem("isLoggedIn", 'true');
          localStorage.setItem("userId", response.userId);
          localStorage.setItem("token", response.token);
          localStorage.setItem("userName", response.userName);
          this.snack.open(`You are sucessfully Registered!`, "OK", {
            duration: 3000
          });
          this.router.navigate(['/contacts'])
        }
      },
      (error) =>{
        console.log("Register Component Error",error);
        this.snack.open(`Some error occured!`, "OK", {
          duration: 3000
        });
      }
    );
  }
}
