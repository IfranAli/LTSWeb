import {TaskModel} from "./task.model";

export type TaskPinnedEvent = {
  taskID: number;
  pinned: boolean;
}

export type TaskUpdatedEvent = {
  task: TaskModel;
  reason: string;
  fields: [string]
}

export type TaskDeletedEvent = {
  taskID: number;
  reason: string;
};
