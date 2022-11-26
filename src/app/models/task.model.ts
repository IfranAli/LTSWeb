import {ScheduleSettings} from "./ScheduleSettings";
import {IdentityInterface} from "./Identity.interface";

export interface TaskDatabaseModel extends IdentityInterface {
  projectId: number
  name: string,
  content: string,
}

export interface TaskModel extends TaskDatabaseModel {
  state: TaskState;
}

export class Task implements TaskModel {
  id: number = 0;
  projectId: number = 0;
  name: string = 'new TaskModel';
  content: string = '';
  state: TaskState = TaskState.TODO;

  scheduleSettings?: ScheduleSettings = undefined;

  constructor(id: number = 0, title: string = 'Untitled TaskModel') {
    this.id = id;
    this.name = title;
  }
}

export enum TaskState {
  TODO = 0, IN_PROGRESS = 1, BLOCKED = 2, DONE = 3,
}
