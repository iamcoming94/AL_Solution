import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './userInterface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private addUserURL = 'http://localhost:58916/api/user/';
  // private getMediaURL = 'http://localhost:58916/api/user/media';
  private getAllUserURL = 'http://localhost:58916/api/user/';
  private deleteUserURL = "http://localhost:58916/api/user/";
  private editUserURL = "http://localhost:58916/api/user/";
  private getUserURL = 'http://localhost:58916/api/user/';

  private userData: { userDataOnly: User[] } = { userDataOnly: [] };

  constructor(private http: HttpClient) { }

  // loadUserForm(){
  //   return this.http.get(this.getMediaURL);
  // }

  addUser(userObject){
    console.log(userObject,'productObject')
    this.http.post(this.addUserURL, userObject).subscribe(data =>{
      console.log(data, 'all data');
    },
    error  => {

      console.log("Error", error);
      
    });
  }

  getAllUsers():Observable<User[]>{
    console.log('hit getAllUsers()');
    return this.http.get<User[]>(this.getAllUserURL);
  }

  deleteUser(id){
    console.log("entered delete user http");
    this.http.delete(this.deleteUserURL + id).subscribe(data =>{
      console.log(data, "delete result")
    }),
    error => {
      console.log("Error when delete user", error);
    }
  }

  editUser(id, body){
    console.log('body',body);
    this.http.put(this.editUserURL + id, body).subscribe(data => {
      console.log("return after edit",data);
    })
    // var result = this.http.put(this.editUserURL + id, {
    //   params: new HttpParams()
    //   .set('userName', body.name)
    //   .set('address', body.address)
    //   .set('dateOfBirth', body.dateOfBirth)
    //   .set('gender', body.gender)
    //   .set('contactNumber', body.contactNumber)
    //   .set('howDidYouFindUsDropDownList', body.howDidYouFindUsDropDownList)
    //   });
  }

  getUser(id)
  {
    console.log("getting a user based on id...");
    return this.http.get(this.getUserURL + id);
  }
}
