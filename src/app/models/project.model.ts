import {Task, TaskState} from "./task";
import {IdentitySingleton} from "../lib/IdentitySingleton";

export interface ProjectModel {
  id: number;
  title: string;
  tasks: Task[];
}

export class Project implements ProjectModel{
  public tasks: Task[] = [];
  public id: number = 0;
  public title: string = '';

  constructor(private identityProvider: IdentitySingleton) {
    this.id = identityProvider.getNextID();
  }

  /**
   * Returns the length of tasks in this project.
   */
  public length() {
    return this.tasks.length;
  }

  public addTask(task: Task): void {
    task.id = this.identityProvider.getNextID();
    task.projectID = this.id;
    this.tasks.push(task);
  }

  public removeTask(task: Task): void {
    const index = this.tasks.findIndex(({id}) => id === task.id);
  }
}
