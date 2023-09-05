import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import {
  createProjectModel,
  ProjectDatabaseModel,
  ProjectModel,
} from "../../models/project.model";
import { UserModel } from "../../models/user.interface";
import { UserService } from "../../services/user.service";
import { Store } from "@ngrx/store";
import { AppState } from "../../reducers";
import { createProject, loadProjects } from "../../actions/project.actions";
import * as fromProjects from "../../reducers/projects.reducer";
import { loadTasks } from "../../actions/task.actions";
import { TaskModel, createTaskModel } from "../../models/task.model";
import { Router } from "@angular/router";
import * as fromUsers from "../../reducers/user.reducer";
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatestWith,
  concatMap,
  filter,
  forkJoin,
  map,
  of,
  switchMap,
  tap,
} from "rxjs";
import { ProjectService } from "src/app/services/project.service";

@Component({
  selector: "app-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects: ProjectModel[] = [];
  user: UserModel | null = null;
  showInactiveProjects = false;

  refresh$ = new BehaviorSubject<boolean>(true);

  constructor(
    private projectService: ProjectService,
    private store: Store<AppState>,
  ) {}

  projectsSort = function (a: ProjectModel, b: ProjectModel): number {
    return a.enabled === b.enabled ? 0 : a.enabled ? -1 : 1;
  };

  // projectEntities$ = this.store.select(fromProjects.selectEntities);

  projects$ = this.store.select(fromProjects.selectEntities).pipe(
    combineLatestWith(this.refresh$),
    filter(([projects, refresh]) => {
      return Object.keys(projects).length != 0;
    }),
    switchMap(([v, refresh]) => {
      const projects = Object.values(v) as ProjectModel[];

      if (this.showInactiveProjects) {
        return of(projects.sort(this.projectsSort));
      } else {
        return of(projects.filter((project) => project.enabled));
      }
    })
  );

  projectsFromEndpoint$ = this.projectService.getProjects().pipe(
    switchMap((projects) => {
      return of(projects);
    }),
    catchError((err) => {
      const project: ProjectModel = {
        id: 0,
        title: "Error",
        enabled: false,
        tasks: [],
        description: "",
        colour: "",
        code: "",
      };
      console.log("err", err);
      return of([project]);
    })
  );
  projectsData$ = this.projectsFromEndpoint$.pipe(
    concatMap((projects) =>
      forkJoin(
        projects.map((project) => {
          return this.projectService
            .getTasksByProjectID(project.id)
            .pipe(
              map((tasks) => ({ ...project, tasks: tasks as TaskModel[] }))
            );
        })
      )
    )
  );

  ngOnInit() {}

  ngOnDestroy() {
    this.refresh$.complete();
  }

  addProject() {
    const model: Omit<ProjectDatabaseModel, "id"> = {
      ...createProjectModel({
        title: "New Project",
      }),
    };

    this.projectService
      .createProject(model)
      .pipe(tap((project) => this.refresh()))
      .subscribe((res) => this.store.dispatch(createProject(res.shift()!)));
  }

  private refresh() {
    this.refresh$.next(true);
  }
}
