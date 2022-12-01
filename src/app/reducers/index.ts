import {ActionReducerMap} from "@ngrx/store";
import * as fromProject from "./projects.reducer";
import * as fromTasks from "./tasks.reducer";
import {ProjectsState} from "./projects.reducer";
import {TasksState} from "./tasks.reducer";

export interface AppState {
  projects: ProjectsState
  tasks: TasksState
}

export const reducers: ActionReducerMap<AppState> = {
  projects: fromProject.projectsReducer,
  tasks: fromTasks.tasksReducer,
}
