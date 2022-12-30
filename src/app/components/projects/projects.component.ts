import { Component, OnInit } from '@angular/core';
import {ProjectModel} from "../../models/project.model";
import {UserLoginResult, UserModel} from "../../models/user.interface";
import {DataProviderService} from "../../services/data-provider.service";
import {UserService} from "../../services/user.service";
import {Store} from "@ngrx/store";
import {AppState} from "../../reducers";
import {loadProjects} from "../../actions/project.actions";
import * as fromProjects from "../../reducers/projects.reducer";
import {loadTasks} from "../../actions/task.actions";
import {createTaskModel} from "../../models/task.model";
import {logoutUser} from "../../actions/user.actions";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
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

}
