import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProjectDatabaseModel, ProjectModel} from "../models/project.model";
import {TaskDatabaseModel, TaskModel, TaskModelPublic} from "../models/task.model";
import {environment} from "../../environments/environment";

const baseUrl = environment.backendURL;

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

  updateTask(task: Partial<TaskModel>) {
    const url = `tasks/${task.id}`;
    return this.http.put<TaskDatabaseModel[]>(baseUrl + url, task);
  }

  deleteTask(taskId: number) {
    const url = `tasks/${taskId}`;
    return this.http.delete<ResponseMessage>(baseUrl + url);
  }

  updateProject(model: ProjectModel) {
    const url = `projects/${model.id}`;
    return this.http.put<ProjectDatabaseModel[]>(baseUrl + url, model);
  }
}
