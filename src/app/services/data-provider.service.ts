import {Injectable} from '@angular/core';
import {TaskDatabaseModel, TaskDatabaseModels, TaskModelPublic} from "../models/task.model";
import {ProjectModel} from "../models/project.model";
import {ProjectService, ResponseMessage} from "../project.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  constructor(private projectService: ProjectService) {
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

  public deleteTask(taskId: number): Observable<ResponseMessage> {
    return this.projectService.deleteTask(taskId);
  }
}
