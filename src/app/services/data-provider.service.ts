import {Injectable} from '@angular/core';
import {TaskDatabaseModel, TaskModelPublic} from "../models/task.model";
import {ProjectModel} from "../models/project.model";
import {ProjectService} from "./project.service";
import {Observable} from "rxjs";
import {UserService} from "./user.service";
import {ResponseMessage} from "../constants/web-constants";

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  constructor(
    public projectService: ProjectService,
    public userService: UserService,
  ) {
  }

  public getProjects(): Observable<ProjectModel[]> {
    return this.projectService.getProjects();
  }

  public getTasks(): Observable<TaskDatabaseModel[]> {
    return this.projectService.getTasks();
  }

  public addTask(task: Partial<TaskModelPublic>): Observable<TaskDatabaseModel[]> {
    return this.projectService.createTaskOnProject(task);
  }

  public updateTask(task: Partial<TaskModelPublic>): Observable<TaskDatabaseModel[]> {
    return this.projectService.updateTask(task);
  }

  public deleteTask(taskId: number): Observable<ResponseMessage> {
    return this.projectService.deleteTask(taskId);
  }

  updateProject(model: ProjectModel) {
    return this.projectService.updateProject(model);
  }
}
