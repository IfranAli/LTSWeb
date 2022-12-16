import {ScheduleSettings} from "./ScheduleSettings";
import {IdentityInterface} from "./Identity.interface";
import {createEntityAdapter} from "@ngrx/entity";
import {TaskState} from "../constants/constants";

export interface TaskModelPublic {
  projectId: number
  name: string,
  content: string,
  state: TaskState;
}

export interface TaskDatabaseModel extends TaskModelPublic, IdentityInterface {
}

export interface TaskModel extends TaskDatabaseModel {

}

export interface TaskDatabaseModels {
  entities: TaskModel[];
}

export const tasksAdapter = createEntityAdapter<TaskModel>();

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
