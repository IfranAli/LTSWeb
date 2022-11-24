import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProjectModel} from "./models/project.model";
import {TaskDatabaseModel} from "./models/task.model";

// todo: put in env
const baseUrl = 'http://localhost:7420/api/';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(
    private http: HttpClient
  ) {
  }

  getProjects() {
    let url = 'projects';
    return this.http.get<ProjectModel[]>(baseUrl + url);
  }

  getTasks(projectID: number) {
    let url = `projects/${projectID}/tasks`;
    return this.http.get<TaskDatabaseModel[]>(baseUrl + url);
  }
}
