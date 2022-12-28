import {createFeatureSelector, createReducer, on} from '@ngrx/store';
import {createTaskModel, TaskModel, tasksAdapter} from "../models/task.model";
import {createTask, deleteTask, loadTasks, updateTask} from "../actions/task.actions";
import {TaskState} from "../constants/constants";
import {UserDatabaseModel, UserModelInvalid} from "../models/user.interface";
import {loginUser, logoutUser} from "../actions/user.actions";

export interface UserState {
  user: UserDatabaseModel | null
}

const defaultEntityState: UserState = {
  user: null
}

const initialState = defaultEntityState;
export const selectUserState = createFeatureSelector<UserState>('user');

// export const {
//   selectIds,
//   selectEntities
// } = tasksAdapter.getSelectors(selectUserState);

export const userReducer = createReducer(
    initialState,
    on(logoutUser, () => {
      return {user: null}
    }),
    on(loginUser, (state, payload) => {
      return {
        user: {
          id: payload.id,
          username: payload.username,
          password: payload.password,
        }
      }
    }),
  )
;
