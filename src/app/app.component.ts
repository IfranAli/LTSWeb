import {Component, OnInit} from '@angular/core';
import {UserModel} from "./models/user.interface";
import {UserService} from "./services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'LTSweb';
  user: UserModel | null = null;

  constructor(
    private userService: UserService,
  ) {
  }

  ngOnInit() {
  }

  userLogout() {
    this.userService.logoutUser().subscribe(value => {
      this.user = null;
    })
  }
}
