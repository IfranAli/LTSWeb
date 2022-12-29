import {Component, OnInit} from '@angular/core';
import {DataProviderService} from "./services/data-provider.service";
import {Store} from "@ngrx/store";
import * as fromProjects from "./reducers/projects.reducer";
import {createTaskModel,} from "./models/task.model";
import {ProjectModel} from "./models/project.model";
import {AppState} from "./reducers";
import {logoutUser} from "./actions/user.actions";
import {loadProjects} from "./actions/project.actions";
import {loadTasks} from "./actions/task.actions";
import {UserLoginResult, UserModel} from "./models/user.interface";
import {UserService} from "./services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'LTSweb';
  projects: ProjectModel[] = [];
  user: UserModel | null = null;


  constructor(
    private dataProvider: DataProviderService,
    private userService: UserService,
    private store: Store<AppState>,
  ) {
  }

  loadProjectsAndTasks() {
    this.dataProvider.getProjects().subscribe((projects) => {
      this.store.dispatch(loadProjects({entities: projects}))

      this.store.select(fromProjects.selectEntities).subscribe(value => {
        this.projects = Object.values(value) as ProjectModel[];
      });

      console.log(this.store.subscribe(value => {
        console.log(value);
      }));
    })

    this.dataProvider.getTasks().subscribe(dbTasks => {
      this.store.dispatch(loadTasks({
        entities: dbTasks.map(dbTask => createTaskModel(dbTask))
      }))
    });
  }

  ngOnInit() {
    this.dataProvider.getUserStatus().subscribe({
      next: value => this.onUserLogin(value.shift()!),
      error: (err: Response) => {
        if (err.status == 401) {
          this.store.dispatch(logoutUser())
        }
      },
    })

    this.store.subscribe((value) => console.log(value))
  }

  onUserLogin($event: UserLoginResult) {
    this.user = $event
    this.loadProjectsAndTasks();
  }

  userLogout() {
    this.userService.logoutUser().subscribe(value => {
      this.user = null;
    })
  }
}
