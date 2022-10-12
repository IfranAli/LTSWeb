import {Injectable} from '@angular/core';
import {Task, TaskState} from "../models/task.model";
import {TaskMockData} from "../mockData/task-data.mock";

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  private tasks: Task[] = [];
  private uuidCount = 5;

  constructor() {
    this.buildTestTasks();
  }

  public getTasks(): Task[] {
    return this.tasks;
  }

  public newTask(): Task {
    let task = new Task();
    task.id = ++this.uuidCount;
    return task;
  }

  public getTask(): Task {
    return this.tasks[0];
  }

  private buildTestTasks(): void {
    this.tasks = TaskMockData;
  }
}
