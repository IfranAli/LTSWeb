import {ScheduleSettings} from "./ScheduleSettings";
import {IdentityInterface} from "./Identity.interface";

export interface TaskDatabaseModel extends IdentityInterface {
  ProjectID: number
  Name: string,
  Content: string,
}

export interface TaskModel extends TaskDatabaseModel {
  state: TaskState;
}

export class Task implements TaskModel {
  id: number = 0;
  ProjectID: number = 0;
  Name: string = 'new TaskModel';
  Content: string = '';
  state: TaskState = TaskState.TODO;

  isPinned: boolean = false;
  isArchived: boolean = false;
  scheduleSettings?: ScheduleSettings = undefined;

  constructor(id: number = 0, title: string = 'Untitled TaskModel') {
    this.id = id;
    this.Name = title;
  }
}

export enum TaskState {
  TODO = 0, IN_PROGRESS = 1, BLOCKED = 2, DONE = 3,
}
