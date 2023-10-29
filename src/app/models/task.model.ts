import { ScheduleSettings } from "./ScheduleSettings";
import { IdentityInterface } from "./Identity.interface";
import { Priority, TaskState } from "../constants/constants";

export interface TaskModelPublic {
  projectId: number;
  name: string;
  content: string;
  state: TaskState;
  priority: Priority;
}

const defaultTask: TaskModel = {
  content: "",
  id: -1,
  name: "",
  projectId: -1,
  state: TaskState.TODO,
  priority: Priority.MEDIUM,
};

export interface TaskDatabaseModel extends TaskModelPublic, IdentityInterface {}

export interface TaskModel extends TaskDatabaseModel {}

export interface TaskDatabaseModels {
  entities: TaskModel[];
}

export class Task implements TaskModel {
  id: number = defaultTask.id;
  projectId: number = defaultTask.projectId;
  name: string = defaultTask.name;
  content: string = defaultTask.content;
  state: TaskState = defaultTask.state;
  priority = defaultTask.priority;

  scheduleSettings?: ScheduleSettings = undefined;

  constructor(id: number = 0, name: string = defaultTask.name) {
    this.id = id;
    this.name = name;
  }
}

export function createTaskModel(
  model: Partial<TaskModel> = {},
  defaultVar: TaskModel = defaultTask
): TaskModel {
  return {
    id: model.id ?? defaultVar.id,
    projectId: model.projectId ?? defaultVar.projectId,
    name: model.name ?? defaultVar.name,
    content: model.content ?? defaultVar.content,
    state: model.state ?? defaultTask.state,
    priority: model.priority ?? defaultVar.priority,
  };
}
