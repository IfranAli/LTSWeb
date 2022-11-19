import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProjectDatabaseModel, ProjectDatabaseModels} from "./models/project.model";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private http: HttpClient
  ) {
  }

  getProjects() {
    let url = 'http://localhost:7420/api/projects';
    return this.http.get<ProjectDatabaseModel[]>(url);
  }

  getProject(id: number) {
    let url = 'http://localhost:7420/api/projects';
    url += id.toString();
    return this.http.get(url);
  }
}
