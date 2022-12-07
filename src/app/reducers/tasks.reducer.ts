import {createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
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
      id: payload.id!,
      projectId: payload.projectId ?? 0,
      name: payload.name ?? '',
      content: payload.content ?? '',
      state: TaskState.TODO
    }
    return tasksAdapter.addOne(newTask, state)
  }),
  on(updateTask, (state, payload) => {
    return tasksAdapter.updateOne({
      changes: {
        name: payload.name,
        content: payload.content,
        projectId: payload.projectId,
      },
      id: payload.id!
    }, state);
  }),
  on(deleteTask, (state, payload) => {
    if (payload.id != null) {
      return tasksAdapter.removeOne(payload.id, state);
    }

    return state;
  }),
);
