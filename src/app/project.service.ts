import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProjectModel} from "./models/project.model";
import {TaskDatabaseModel, TaskModelPublic} from "./models/task.model";

// todo: put in env
const baseUrl = 'http://localhost:7420/api/';

export interface ResponseMessage {
  success: boolean,
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(
    private http: HttpClient
  ) {
  }

  getProjects() {
    const url = 'projects';
    return this.http.get<ProjectModel[]>(baseUrl + url);
  }

  getTasks() {
    const url = `tasks/`;
    return this.http.get<TaskDatabaseModel[]>(baseUrl + url);
  }

  getTasksByProjectID(projectID: number) {
    const url = `projects/${projectID}/tasks`;
    return this.http.get<TaskDatabaseModel[]>(baseUrl + url);
  }

  createTaskOnProject(task: Partial<TaskModelPublic>) {
    const url = `projects/${task.projectId}`;
    return this.http.post<TaskDatabaseModel[]>(baseUrl + url, task);
  }

  deleteTask(taskId: number) {
    const url = `tasks/${taskId}`;
    return this.http.delete<ResponseMessage>(baseUrl + url);
  }
}
