import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {createProjectModel, ProjectDatabaseModel, ProjectModel} from "../../models/project.model";
import {UserModel} from "../../models/user.interface";
import {DataProviderService} from "../../services/data-provider.service";
import {UserService} from "../../services/user.service";
import {Store} from "@ngrx/store";
import {AppState} from "../../reducers";
import {createProject, loadProjects} from "../../actions/project.actions";
import * as fromProjects from "../../reducers/projects.reducer";
import {loadTasks} from "../../actions/task.actions";
import {createTaskModel} from "../../models/task.model";
import {Router} from "@angular/router";
import * as fromUsers from '../../reducers/user.reducer';
import {filter, of, switchMap, tap} from 'rxjs';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  projects$ = this.store.select(fromProjects.selectEntities).pipe(
    filter((projects) => {
      return Object.keys(projects).length != 0;
    }),
    switchMap((v) => {
      const projects = Object.values(v) as ProjectModel[];

      if (this.showInactiveProjects) {
        return of(projects.sort(this.projectsSort));
      } else {

        return of(projects.filter(project => project.enabled));
      }
    })
  );

  loadProjectsAndTasks() {
    this.dataProvider.getProjects().subscribe((projects) => {

      this.dataProvider.getTasks().subscribe(dbTasks => {
        this.store.dispatch(loadTasks({
          entities: dbTasks.map(dbTask => createTaskModel(dbTask))
        }))
        this.store.dispatch(loadProjects({entities: projects}))
      });
    })
  }

  ngOnInit() {
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
