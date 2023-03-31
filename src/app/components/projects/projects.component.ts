import {Component, OnInit} from '@angular/core';
import {createProjectModel, ProjectDatabaseModel, ProjectModel} from "../../models/project.model";
import {UserLoginResult, UserModel} from "../../models/user.interface";
import {DataProviderService} from "../../services/data-provider.service";
import {UserService} from "../../services/user.service";
import {Store} from "@ngrx/store";
import {AppState} from "../../reducers";
import {createProject, loadProjects} from "../../actions/project.actions";
import * as fromProjects from "../../reducers/projects.reducer";
import {loadTasks} from "../../actions/task.actions";
import {createTaskModel, TaskModel} from "../../models/task.model";
import {logoutUser} from "../../actions/user.actions";
import {Router} from "@angular/router";
import {TaskState} from "../../constants/constants";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projects: ProjectModel[] = [];
  user: UserModel | null = null;
  showInactiveProjects = false;

  constructor(
    private dataProvider: DataProviderService,
    private userService: UserService,
    private store: Store<AppState>,
    private router: Router,
  ) {
  }

  projectsSort = function (a: ProjectModel, b: ProjectModel): number {
    return (a.enabled === b.enabled) ? 0 : (a.enabled ? -1 : 1);
  }

  loadProjectsAndTasks() {
    this.dataProvider.getProjects().subscribe((projects) => {
      this.store.dispatch(loadProjects({entities: projects}))

      this.store.select(fromProjects.selectEntities).subscribe(value => {
        const projects = Object.values(value) as ProjectModel[];

        if (this.showInactiveProjects) {
          this.projects = projects.sort(this.projectsSort);
        } else {
          this.projects = projects.filter(project => project.enabled);
        }
      });
    })

    this.dataProvider.getTasks().subscribe(dbTasks => {
      this.store.dispatch(loadTasks({
        entities: dbTasks.map(dbTask => createTaskModel(dbTask))
      }))
    });
  }

  ngOnInit() {
    this.dataProvider.getUserStatus().subscribe({
      next: (value) => {
        return this.onUserLogin(value[0])
      },
      error: (err: Response) => {
        if (err.status == 401) {
          this.router.navigate([''])
            .then(_ => this.store.dispatch(logoutUser()))
        }
      },
    })

    // this.store.subscribe((value) => console.log(value))
  }

  onUserLogin($event: UserLoginResult) {
    this.user = $event
    this.loadProjectsAndTasks();
  }

  addProject() {
    const model: Omit<ProjectDatabaseModel, 'id'> = {
      ...createProjectModel({
        title: 'New Project',
      })
    }

    this.dataProvider.projectService.createProject(model)
      .subscribe(res => this.store.dispatch(createProject(res.shift()!)))
  }
}
