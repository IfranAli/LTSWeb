import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {TaskDatabaseModel} from "../models/task.model";
import {UserDatabaseModel, UserLoginModel} from "../models/user.interface";

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
    return this.http.get<UserDatabaseModel[]>(baseUrl);
  }

  loginUser(userLoginModel: UserLoginModel) {
    const loginUrl = baseUrl + '/login';
    return this.http.post<UserDatabaseModel>(loginUrl, userLoginModel);
  }
}
