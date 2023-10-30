import { Injectable, Signal, computed, effect, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ProjectDatabaseModel, ProjectModel } from "../models/project.model";
import {
  TaskDatabaseModel,
  TaskModel,
  TaskModelPublic,
} from "../models/task.model";
import { environment } from "../../environments/environment";
import { getHttpHeaders, ResponseMessage } from "../constants/web-constants";
import {
  BehaviorSubject,
  Observable,
  combineLatestWith,
  concatMap,
  forkJoin,
  map,
} from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";

const baseUrl = environment.backendURL;

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  $refreshProjects = new BehaviorSubject<boolean>(true);
  $selectedTask = signal<TaskModel | null>(null);

  // todo: Store the whole project object.
  $selectedProjectId = signal<number>(-1);
  $selectedProject = computed(() => {
    const id = this.$selectedProjectId();

    const project =
      id > 0
        ? this.$projectsWithTasks().find((project) => project.id === id)
        : null;
    return project;
  });
  $projectsWithTasks: Signal<ProjectModel[]> = computed(() => {
    const projectsWithTasks = this.$projectsDataSignal();
    return projectsWithTasks;
  });

  private projectsData$ = this.getProjects().pipe(
    combineLatestWith(this.$refreshProjects),
    concatMap(([projects, refresh]) =>
      forkJoin(
        projects.map((project) => {
          return this.getTasksByProjectID(project.id).pipe(
            map((tasks) => ({ ...project, tasks: tasks as TaskModel[] }))
          );
        })
      )
    )
  );

  private $projectsDataSignal = toSignal(this.projectsData$, {
    initialValue: [],
  });

  private getProjects(): Observable<ProjectModel[]> {
    const url = "projects";
    return this.http.get<ProjectModel[]>(baseUrl + url, getHttpHeaders());
  }

  createProject(project: Omit<ProjectDatabaseModel, "id">) {
    const url = "projects";
    return this.http.post<ProjectDatabaseModel[]>(
      baseUrl + url,
      project,
      getHttpHeaders()
    );
  }

  deleteProject(projectID: number) {
    const url = "projects/".concat(projectID.toString());
    return this.http.delete<ResponseMessage>(baseUrl + url, getHttpHeaders());
  }

  getTasks() {
    const url = `tasks/`;
    return this.http.get<TaskDatabaseModel[]>(baseUrl + url, getHttpHeaders());
  }

  getTasksByProjectID(projectID: number) {
    const url = `projects/${projectID}/tasks`;
    return this.http.get<TaskDatabaseModel[]>(baseUrl + url, getHttpHeaders());
  }

  createTaskOnProject(task: Partial<TaskModelPublic>) {
    const url = `projects/${task.projectId}`;
    return this.http.post<TaskDatabaseModel[]>(
      baseUrl + url,
      task,
      getHttpHeaders()
    );
  }

  updateTask(task: Partial<TaskModel>) {
    const url = `tasks/${task.id}`;
    return this.http.put<TaskDatabaseModel[]>(
      baseUrl + url,
      task,
      getHttpHeaders()
    );
  }

  deleteTask(taskId: number) {
    const url = `tasks/${taskId}`;
    return this.http.delete<ResponseMessage>(baseUrl + url, getHttpHeaders());
  }

  updateProject(model: ProjectModel) {
    const url = `projects/${model.id}`;
    return this.http.put<ProjectDatabaseModel[]>(
      baseUrl + url,
      model,
      getHttpHeaders()
    );
  }
}
