import {Injectable} from '@angular/core';
import {Task} from "../models/task";
import {ProjectDataMock} from "../mockData/project-data.mock";
import {Project, ProjectDatabaseModel} from "../models/project.model";
import {IdentitySingleton} from "../lib/IdentitySingleton";
import {TaskFactory} from "../lib/TaskFactory";
import {ProjectFactory} from "../lib/ProjectFactory";
import {ProjectService} from "../project.service";
import {Observable} from "rxjs";

export let taskIdentityProvider = IdentitySingleton.getInstance();
export let projectIdentityProvider = IdentitySingleton.getInstance();

let taskFactory = new TaskFactory(taskIdentityProvider);
let projectFactory = new ProjectFactory(projectIdentityProvider);

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  private projects: Project[] = [];
  private tasks: Task[] = [];
  private nextTaskIndexID = 0;
  private nextProjectIndexID = 0;

  constructor(
    private projectService: ProjectService
  ) {
  }

  public getProjects(): Observable<ProjectDatabaseModel[]> {
    return this.projectService.getProjects();
  }

  public addTask(task: Task = new Task()): Task {
    let newTask = taskFactory.newTask();
    this.tasks.push(newTask);
    return newTask;
  }

  public addProject(): Project {
    let newProject = projectFactory.newProject();
    this.projects.push(newProject);
    return newProject;
  }

  private buildTestProjects(): void {
    this.projects = ProjectDataMock();
  }
}
