import {Injectable} from '@angular/core';
import {Task, TaskState} from "../models/task.model";
import {TaskMockData} from "../mockData/Task.mock";

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  private tasks: Task[] = [];

  constructor() {
    this.buildTestTasks();
  }

  public getTasks(): Task[] {
    return this.tasks;
  }

  public getTask(): Task {
    return this.tasks[0];
  }

  private buildTestTasks(): void {
    this.tasks = TaskMockData;
  }

  private static newTask(): Task {
    var task: Task = {
      id: 3,
      state: TaskState.DONE,
      title: "Task 4",
      isPinned: false,
      isArchived: false
    };

    return task;
  }
}
