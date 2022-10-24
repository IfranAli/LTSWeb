import {Task} from "./task";
import {IdentitySingleton} from "../lib/IdentitySingleton";
import {TaskFactory} from "../lib/TaskFactory";

export interface ProjectModel {
  id: number;
  title: string;
  tasks: Task[];
}

export class Project implements ProjectModel {
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
