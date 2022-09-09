import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  rForm!: FormGroup;
  errorMessage!: string | null;
  successMessage!: string | null;
  loginForm: any;

  constructor(private loginService: LoginService, private router: Router, private fb: FormBuilder, private snack: MatSnackBar) { }

  ngOnInit(): void {
    this.checkIfLoggedIn();
    this.loginService.checkCors().subscribe(
      (response) => {
        console.log('check Cors', response);
      }, 
      (err) => {
        console.log('error in check Cors error', err)
      }
    )

    this.rForm = this.fb.group({
      email : ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  register(): void {
    this.router.navigate(['/register'])
  }
  checkIfLoggedIn(): void {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if(userId && token){
      this.router.navigate(['/contacts']);
    }
  }

  userLogin(){
    this.errorMessage = null;
    this.successMessage = null;

    this.loginForm = {
      userName: this.rForm.value.userName,
      email: this.rForm.value.email,
      password: this.rForm.value.password
    }
    this.loginService.login(this.loginForm).subscribe(
      (response) => {
        console.log('Login Response',response);
        if(response) {
          localStorage.setItem("isLoggedIn", 'true');
          localStorage.setItem("userId", response.userId);
          localStorage.setItem("token", response.token);
          localStorage.setItem("userName", response.userName);
          this.snack.open(`You are sucessfully Logged In!`, "OK", {
            duration: 3000
          });
          this.router.navigate(['/contacts'])
        }
      },
      (error) =>{
        console.log("Login Component Error",error);
        this.snack.open(`Some error occured!`, "OK", {
          duration: 3000
        });
      }
    );
  }

}
