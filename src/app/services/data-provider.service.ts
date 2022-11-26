import {Injectable} from '@angular/core';
import {TaskDatabaseModel} from "../models/task.model";
import {ProjectDatabaseModel, ProjectModel} from "../models/project.model";
import {ProjectService} from "../project.service";
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

  public getTasksByProject(project: ProjectDatabaseModel): Observable<TaskDatabaseModel[]> {
    return this.projectService.getTasks(project.id);
  }
}
