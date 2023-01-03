import {Component, OnInit} from '@angular/core';
import {UserModel} from "./models/user.interface";
import {UserService} from "./services/user.service";
import {Router} from "@angular/router";

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
    private router: Router,
  ) {
  }

  ngOnInit() {
  }

  userLogout() {
    this.userService.logoutUser().subscribe(async value => {
      this.user = null;
      await this.router.navigate(['']);
    })
  }
}
