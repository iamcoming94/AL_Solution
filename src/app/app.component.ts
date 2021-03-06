import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable, Subject, Subscription } from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { element } from 'protractor';
import { User } from './userInterface';
import { map } from 'rxjs/operators';
import { userInfo } from 'os';

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
  displayedColumns = ['userName', 'dateOfBirth', 'address', 'gender', 'contactNumber', 'howDidYouFindUsDropDownList', 'edit', 'delete'];

  public userData : any;
  hiddenFlag : boolean;

  // @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private formBuilder:FormBuilder, private http: HttpClient, private userService: UserService) { 
    this.editUserForm();
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});
  }

  ngOnInit(): void {
    this.hiddenFlag = true;
    this.editUserForm();
    this.data = this.getAllUser();
    // this.data = this.allItems;
    console.log('data',this.data);
    // this.dataSource.data = this.data;
    // this.dataSource.paginator = this.paginator;
  }

  editUserForm(){
    this.userForm = this.formBuilder.group({
      id:[''],
      name: ['', [Validators.required, Validators.minLength(2)]],
      dateOfBirth: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      gender: ['', [Validators.required, Validators.minLength(1)]],
      contactNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      howDidYouFindUsDropDownList: ['Select Option', [Validators.required]]
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
      "HowDidYouFindUsDropDownList": userDetails.howDidYouFindUsDropDownList
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
  var userDetails = this.userForm.getRawValue();

  this.userModel = {
    'UserName': userDetails.name,
    'DateOfBirth': userDetails.dateOfBirth,
    "Address": userDetails.address,
    "Gender": userDetails.gender,
    "ContactNumber": userDetails.contactNumber,
    "HowDidYouFindUsDropDownList": userDetails.howDidYouFindUsDropDownList
  }

  console.log('submitForm', userDetails.id);
  if(userDetails.id != 0)
  {
    console.log('entered edit mode', userDetails.id);
    this.userService.editUser(userDetails.id, this.userModel);
  }

  else
  {
    console.log('entered create mode', userDetails.id);
    
    this.userService.addUser(this.userModel);
  }

  window.location.reload();
  //reload form
  this.editUserForm();
  }

  getAllUser(){
    this.subscription = this.userService.getAllUsers().subscribe(result =>{
      this.dataSource.data = result;
      console.log(result)
    })
    // return this.userService.getAllUsers();
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

  openFilter(col:string){
    document.getElementById(col + '-filter').removeAttribute('hidden');
  }

  closeFilter(col:string){
    document.getElementById(col + '-filter').setAttribute('hidden', 'true');
  }
  filterData(col: string, filtertext: string){
    if(filtertext.trim() != '')
    {
      this.dataSource.data = this.data.slice().filter(
        (element) => JSON.stringify(element[col]).indexOf(filtertext) > -1
      );
    }
  }

  editUser(id){
    console.log("this is the user id ", id);
    this.subscription = this.userService.getUser(id).subscribe(result => {
      this.userData = result;
      console.log('editformdata', this.userData);
      this.userForm.setValue({
        id: this.userData.id,
        name: this.userData.userName,
        dateOfBirth : this.userData.dateOfBirth,
        address : this.userData.address,
        gender : this.userData.gender,
        contactNumber : this.userData.contactNumber,
        howDidYouFindUsDropDownList : this.userData.howDidYouFindUsDropDownList
      });
    })
  }

  deleteUser(id){
    console.log("this is delete id ", id);
    this.userService.deleteUser(id);
    window.location.reload();
  }

  resetPage(){
    window.location.reload();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
