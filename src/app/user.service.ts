import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private addUserURL = 'http://localhost:58916/api/user/';
  // private getMediaURL = 'http://localhost:58916/api/user/media';
  private getAllUserURL = 'http://localhost:58916/api/user/';

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

  getAllUsers(){
    return this.http.get(this.getAllUserURL);
  }
}
