import {Task} from "./task";
import {IdentitySingleton} from "../lib/IdentitySingleton";
import {TaskFactory} from "../lib/TaskFactory";
import {IdentityInterface} from "./Identity.interface";

export interface ProjectModelPublic {
  Title: string,
  Description: string
}

export interface ProjectDatabaseModel extends ProjectModelPublic, IdentityInterface {
}

export interface ProjectModel extends ProjectDatabaseModel {
  tasks: Task[];
}

export interface ProjectDatabaseModels {
  entities: ProjectDatabaseModel[];
}

export class Project implements ProjectModel {
  ID: number = 0;
  Title: string = '';
  Description: string = '';
  public tasks: Task[] = [];

  constructor(private identityProvider: IdentitySingleton) {
    this.ID = identityProvider.getNextID();
  }

  /**
   * Returns the length of tasks in this project.
   */
  public length() {
    return this.tasks.length;
  }

  public addTask(task: Task): void {
    task.id = this.identityProvider.getNextID();
    task.projectID = this.ID;
    this.tasks.push(task);
  }

  public addSimpleTask(title: string): void {
    let taskFactory = new TaskFactory((this.identityProvider));
    let task = taskFactory.newTask();
    task.title = title;
    this.addTask(task)
  }

  public removeTask(task: Task): void {
    const index = this.tasks.findIndex(({id}) => id === task.id);
  }
}
