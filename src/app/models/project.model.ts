import {IdentityInterface} from "./Identity.interface";
import {TaskModel} from "./task.model";
import {createEntityAdapter} from "@ngrx/entity";

export interface ProjectModelPublic {
  title: string,
  description: string
}

export interface ProjectDatabaseModel extends ProjectModelPublic, IdentityInterface {
}

export interface ProjectModel extends ProjectDatabaseModel {
  tasks: TaskModel[];
}

export interface ProjectDatabaseModels {
  entities: ProjectModel[];
}

export const projectAdapter = createEntityAdapter<ProjectModel>();

export class Project implements ProjectModel {
  id: number = 0;
  title: string = '';
  description: string = '';
  public tasks: TaskModel[] = [];

  /**
   * Returns the length of tasks in this project.
   */
  public length() {
    return this.tasks.length;
  }

  public addTask(task: TaskModel): void {
    task.ProjectID = this.id;
    this.tasks.push(task);
  }
}
