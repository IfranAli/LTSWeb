import {ScheduleSettings} from "./ScheduleSettings";

export interface TaskModel {
  id: number;
  projectID: number;
  title: string;
  content: string;
  state: TaskState;
}

export class Task implements TaskModel {
  id: number = 0;
  projectID: number = 0;
  title: string = 'new Task';
  content: string = '';
  state: TaskState = TaskState.TODO;

  isPinned: boolean = false;
  isArchived: boolean = false;
  scheduleSettings?: ScheduleSettings = undefined;

  constructor(id: number = 0, title: string = 'Untitled Task') {
    this.id = id;
    this.title = title;
  }
}

export enum TaskState {
  TODO = 0, IN_PROGRESS = 1, BLOCKED = 2, DONE = 3,
}
