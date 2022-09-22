import {Task, TaskState} from "./task.model";

export class Project {
  private tasks: Task[] = [];
  private id: number = 0;
  private title: string = '';

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

    // if (index && this.tasks.)
    // this.tasks.
  }
}
