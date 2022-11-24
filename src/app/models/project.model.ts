import {IdentityInterface} from "./Identity.interface";
import {TaskModel} from "./task.model";

export interface ProjectModelPublic {
  Title: string,
  Description: string
}

export interface ProjectDatabaseModel extends ProjectModelPublic, IdentityInterface {
}

export interface ProjectModel extends ProjectDatabaseModel {
  Tasks: TaskModel[];
}

export interface ProjectDatabaseModels {
  entities: ProjectModel[];
}

export class Project implements ProjectModel {
  ID: number = 0;
  Title: string = '';
  Description: string = '';
  public Tasks: TaskModel[] = [];

  /**
   * Returns the length of tasks in this project.
   */
  public length() {
    return this.Tasks.length;
  }

  public addTask(task: TaskModel): void {
    task.ProjectID = this.ID;
    this.Tasks.push(task);
  }
}
