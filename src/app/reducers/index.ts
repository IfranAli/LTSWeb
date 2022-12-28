import {ActionReducerMap} from "@ngrx/store";
import {ProjectsState} from "./projects.reducer";
import {TasksState} from "./tasks.reducer";

import * as fromProject from "./projects.reducer";
import * as fromTasks from "./tasks.reducer";
import * as fromUser from "./user.reducer";
import {UserState} from "./user.reducer";

export interface AppState {
  projects: ProjectsState
  tasks: TasksState
  user: UserState
}

export const reducers: ActionReducerMap<AppState> = {
  projects: fromProject.projectsReducer,
  tasks: fromTasks.tasksReducer,
  user: fromUser.userReducer,
}
