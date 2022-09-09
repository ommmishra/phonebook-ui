import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AddContactComponent } from '../add-contact/add-contact.component';
import { ContactsService } from '../contacts.service';
import { TableTestComponent } from '../table-test/table-test.component';
 
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  userName: any = '';

  @ViewChild(TableTestComponent, { static: false }) childC!: TableTestComponent;

  constructor(public dialog: MatDialog, private cService: ContactsService, private snack: MatSnackBar, private router: Router) { }
  
  ngOnInit(): void {
    this.userName = localStorage.getItem('userName');
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddContactComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        const userId = localStorage.getItem('userId');
        this.cService.addContact({'name': result.name, 'phoneNumber': result.phoneNumber, 'email':result.email, 'userId': userId}).
        subscribe(
          (response) => {
            console.log('Add Contact Response',response);
            this.childC.onUpdate();
            this.snack.open(`Contact Added Successfully!`, "OK", {
              duration: 3000
            });
          },
          (error) =>{
            console.log('Add Contact error', error);
            this.snack.open(`Some Error Occured!`, "OK", {
              duration: 3000
            });
          }
        )
      }
    });
  }
  logOut() {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }

}
