import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, SortDirection } from '@angular/material/sort';
import { catchError, map, merge, Observable, startWith, switchMap, of as observableOf } from 'rxjs';
import { ContactsService } from '../contacts.service';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-table-test',
  templateUrl: './table-test.component.html',
  styleUrls: ['./table-test.component.css']
})
export class TableTestComponent implements AfterViewInit {
  //Angular Material
  displayedColumns: string[] = ['created', 'state', 'number', 'title', 'edit', 'delete'];
  displyedContactColumns: string [] = ['name', 'phoneNumber', 'email',  'edit', 'delete']; 
  exampleDatabase!: ExampleHttpDatabase | null;
  data: GithubIssue[] = [];
  dataSec: dbContacts[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _httpClient: HttpClient, private contactsService: ContactsService, private snack: MatSnackBar, public dialog: MatDialog) {}

  ngAfterViewInit() {
    this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
         return this.exampleDatabase!.getRepoIssuesSec(
            this.sort.direction,
            this.paginator.pageIndex,
          )
          // return this.exampleDatabase!.getRepoIssues(
          //   this.sort.direction,
          //   this.paginator.pageIndex,
          // )
          .pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          // data = null;
          // console.log('Main Data', data)
          // data = null;

          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.total_count;
          return data.items;
        }),
      )
      .subscribe(data => (this.dataSec = data));
  }

  onDelete(row: any){
    // console.log('Heueheuhe', row);
    const deleteDetail = {contactId: row.contact_id, userId: localStorage.getItem('userId')}
    this.contactsService.deleteContact(deleteDetail).subscribe(
      (response) => {
          this.snack.open(`Contact Deleted Successfully!`, "OK", {
            duration: 3000
      });
    // this.paginator.pageIndex = 0;
    this.ngAfterViewInit();
  },
    (err) =>{
      this.snack.open(`Error occured while deleting contact.`, "OK", {
        duration: 3000
      });
    }

    );
  }

  onUpdate(){
    // this.paginator.pageIndex = 0;
    this.ngAfterViewInit();
  }

  onEdit(row: any){
    const contact_id = row.contact_id;
    // console.log('row data', row)
    const editData = {
      name: row.name,
      phone_number: row.phone_number,
      email: row.email 
    }
    const dialogRef = this.dialog.open(EditDialogComponent, {data: editData});
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log('edit',result);
        result.userId = localStorage.getItem('userId');
        result.contactId = contact_id;
        this.contactsService.editContact(result).subscribe(
          (result)=>{
            this.snack.open(`Contact Edited Successfully!`, "OK", {
              duration: 3000
          });
          this.ngAfterViewInit();
          },
          (errors) => {
            this.snack.open(`Error occured while editing contact.`, "OK", {
              duration: 3000
            });
          }
        ) 
      }
    });

  }
}

export interface GithubApi {
  items: GithubIssue[];
  total_count: number;
}

export interface GithubIssue {
  created_at: string;
  number: string;
  state: string;
  title: string;
}

export interface dbContacts {
  contact_id: number;
  name: string;
  phoneNumber: string;
  email: string
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleHttpDatabase {
  constructor(private _httpClient: HttpClient) {}

  getRepoIssues(order: SortDirection, page: number): Observable<any> {
    const href = 'https://api.github.com/search/issues';
    const requestUrl = `${href}?q=repo:angular/components&sort=&order=${order}&page=${
      page + 1
    }`;

    console.log('Check Repo', requestUrl);

    return this._httpClient.get<any>(requestUrl);
  }

  getRepoIssuesSec(order: SortDirection, page: number): Observable<any> {
    const userId = localStorage.getItem('userId');
    const token = String(localStorage.getItem('token'));

    const href = 'getContacts/';
    const requestUrl = `${href}${page}/${order}/${userId}`;
    
    const headers= new HttpHeaders()
    .set('Authorization', token);

    // console.log('Check Repo', requestUrl);

    return this._httpClient.get<any>(requestUrl, {'headers': headers});
  }
}