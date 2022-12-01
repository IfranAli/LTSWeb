import {createFeatureSelector, createReducer, on} from '@ngrx/store';
import {TaskModel, tasksAdapter, TaskState} from "../models/task.model";
import {createTask, deleteTask, loadTasks, updateTask} from "../actions/task.actions";

export interface TasksState {
  ids: [],
  entities: {}
}

const defaultEntityState: TasksState = {
  ids: [],
  entities: {}
}

const initialState = tasksAdapter.getInitialState(defaultEntityState);
export const selectTasksState = createFeatureSelector<TasksState>('tasks');

export const {
  selectIds,
  selectEntities
} = tasksAdapter.getSelectors(selectTasksState);

export const tasksReducer = createReducer(
  initialState,
  on(loadTasks, (state, payload) => {
    return tasksAdapter.addMany(payload.entities, state);
  }),
  on(createTask, (state, payload: Partial<TaskModel>) => {
    const newTask: TaskModel = {
      content: "New task",
      id: payload.id ?? 999,
      name: "test test",
      projectId: payload.projectId ?? 0,
      state: TaskState.TODO
    }
    return tasksAdapter.addOne(newTask, state)
  }),
  on(updateTask, (state) => {
    return state;
  }),
  on(deleteTask, (state) => {
    return state;
  }),
);
