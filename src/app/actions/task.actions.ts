import {createAction, props} from "@ngrx/store";
import {IdentityInterface} from "../models/Identity.interface";
import {TaskDatabaseModels, TaskModel, TaskModelPublic} from "../models/task.model";

export const createTask = createAction(
  'Create Task action', props<TaskModelPublic>()
);

export const updateTask = createAction(
  'Update Task action', props<TaskModelPublic>()
);

export const deleteTask = createAction(
  'Delete Task action', props<IdentityInterface>()
);

export const loadTasks = createAction(
  'Load Task action', props<TaskDatabaseModels>()
);

export const addTaskToTask = createAction(
  'Add Task action', props<Partial<TaskModel>>()
);
