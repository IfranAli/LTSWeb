import {Task} from "./task";
import {Project} from "./project.model";

export type TaskPinnedEvent = {
  taskID: number;
  pinned: boolean;
}

export type TaskUpdatedEvent = {
  task: Task;
  reason: string;
  fields: [string]
}

export type TaskDeletedEvent = {
  taskID: number;
  reason: string;
};
