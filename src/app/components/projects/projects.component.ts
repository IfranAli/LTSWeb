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
import { DataProviderService } from "../../services/data-provider.service";
import { UserService } from "../../services/user.service";
import { Store } from "@ngrx/store";
import { AppState } from "../../reducers";
import { createProject, loadProjects } from "../../actions/project.actions";
import * as fromProjects from "../../reducers/projects.reducer";
import { loadTasks } from "../../actions/task.actions";
import { createTaskModel } from "../../models/task.model";
import { Router } from "@angular/router";
import * as fromUsers from "../../reducers/user.reducer";
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatestWith,
  concatMap,
  filter,
  of,
  switchMap,
  tap,
} from "rxjs";

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
    private dataProvider: DataProviderService,
    private userService: UserService,
    private store: Store<AppState>,
    private router: Router
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

  projectsFromEndpoint$ = this.dataProvider.projectService.getProjects().pipe(
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
    concatMap((projects) => {
      return of(projects);
    }),
  );

  // projectsData$ = this.projectsFromEndpoint$.pipe(
  //   switchMap((projects) => {
  //     const projectIds = projects.map((project) => project.id);
  //     return of(projects);
  //   })
  // );

  loadProjectsAndTasks() {
    // this.projectsData$.subscribe();
    // this.dataProvider.getProjects().subscribe((projects) => {
    //   this.dataProvider.getTasks().subscribe(dbTasks => {
    //     this.store.dispatch(loadTasks({
    //       entities: dbTasks.map(dbTask => createTaskModel(dbTask))
    //     }))
    //     this.store.dispatch(loadProjects({entities: projects}))
    //   });
    // })
  }

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

    this.dataProvider.projectService
      .createProject(model)
      .pipe(tap((project) => this.refresh()))
      .subscribe((res) => this.store.dispatch(createProject(res.shift()!)));
  }

  private refresh() {
    this.refresh$.next(true);
  }
}
