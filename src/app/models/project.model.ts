import {Task, TaskState} from "./task.model";

export class Project {
  tasks: Task[] = [];
  id: number = 0;
  title: string = '';

  constructor(title: string, tasks: Task[] = []) {
    this.title = title;
    this.tasks = tasks;
  }

  /**
   * Returns the length of tasks in this project.
   */
  public length() {
    return this.tasks.length;
  }

  public addTask(task: Task): void {
    this.tasks.push(task);
  }

  public removeTask(task: Task): void
  {
    const index = this.tasks.findIndex(({ id }) => id === task.id);
  }
}
