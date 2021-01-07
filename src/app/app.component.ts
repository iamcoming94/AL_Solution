import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { Subscription } from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'archer';

  private headers: HttpHeaders;
  public allItems : any;
  
  userForm: FormGroup;
  userModel: Object;
  subscription: Subscription;
  mediaDropDownList: Array<any>;

  mediaDDL : any=['Facebook', 'Instagram', 'TikTok'];

  dataSource = new MatTableDataSource<any>();
  data: any;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private formBuilder:FormBuilder, private http: HttpClient, private userService: UserService) { 
    this.editUserForm();
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});
  }

  ngOnInit(): void {
    this.editUserForm();
    // this.data = this.getAllUser();
    // this.dataSource.data = this.data;
    // this.dataSource.paginator = this.paginator;
  }

  editUserForm(){
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      dateOfBirth: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      gender: ['', [Validators.required, Validators.minLength(1)]],
      contactNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      howDidYouFindUs: ['Select Option', [Validators.required]]
    });
  }

  submitUserForm(){

    if(this.userForm.invalid){
      return;
    }
    var userDetails = this.userForm.getRawValue();
    
    this.userModel = {
      'UserName': userDetails.name,
      'DateOfBirth': userDetails.dateOfBirth,
      "Address": userDetails.address,
      "Gender": userDetails.gender,
      "ContactNumber": userDetails.contactNumber,
      "HowDidYouFindUsDropDownList": userDetails.howDidYouFindUs
    }
    this.userService.addUser(this.userModel);
    
    //reload form
    this.editUserForm();
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.productForm.value, null, 4));
  }

  loadNewForm(){
    // this.subscription = this.userService.loadUserForm().subscribe(result =>{
    //   this.allItems = result;
    //   this.mediaDropDownList = this.allItems.mediaDropDownList;
    // });
  }

submitForm(){

  if(this.userForm.invalid){
    return;
  }
  // this.productForm.controls['your form control name'].value
  // this.productModel = this.productForm.getRawValue();
  var userDetails = this.userForm.getRawValue();
  
  this.userModel = {
    'UserName': userDetails.name,
    'DateOfBirth': userDetails.dateOfBirth,
    "Address": userDetails.address,
    "Gender": userDetails.gender,
    "ContactNumber": userDetails.contactNumber,
    "HowDidYouFindUsDropDownList": userDetails.howDidYouFindUs
  }
  this.userService.addUser(this.userModel);
  
  //reload form
  this.editUserForm();
  }

  getAllUser(){
    this.subscription = this.userService.getAllUsers().subscribe(result =>{
      this.allItems = result;
      console.log("all users", this.allItems);
    })
  }

  sortData($event){
    const sortId = $event.active;
    const sortDirection = $event.direction;
    if('asc' == sortDirection){
      this.dataSource.data = this.data.slice().sort(
        (a,b) => a[sortId] > b[sortId] ? -1 : a[sortId] < b[sortId] ? 1 : 0
      );
    }
    else{
      this.dataSource.data = this.data.slice().sort(
        (a,b) => a[sortId] < b[sortId] ? -1 : a[sortId] > b[sortId] ? 1 : 0
      );
    }
  }

}
