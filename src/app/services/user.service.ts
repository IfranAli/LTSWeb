import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {UserDatabaseModel, UserLoginModel} from "../models/user.interface";
import {httpHeaders} from "../constants/web-constants";

const baseUrl = environment.backendURL + 'user'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) {
  }

  getUsers() {
    return this.http.get<UserDatabaseModel[]>(baseUrl, httpHeaders);
  }

  loginUser(userLoginModel: UserLoginModel) {
    const loginUrl = baseUrl + '/login';
    return this.http.post<UserDatabaseModel>(loginUrl, userLoginModel, httpHeaders);
  }
}
