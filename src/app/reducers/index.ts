import {ActionReducerMap} from "@ngrx/store";
import {ProjectsState} from "./projects.reducer";
import {TasksState} from "./tasks.reducer";

import * as fromProject from "./projects.reducer";
import * as fromTasks from "./tasks.reducer";
import * as fromUser from "./user.reducer";
import * as fromFinance from "./finance.reducer";
import {UserState} from "./user.reducer";
import {FinanceState} from "./finance.reducer";

export interface AppState {
  projects: ProjectsState
  tasks: TasksState
  user: UserState
  finance: FinanceState
}

export const reducers: ActionReducerMap<AppState> = {
  projects: fromProject.projectsReducer,
  tasks: fromTasks.tasksReducer,
  user: fromUser.userReducer,
  finance: fromFinance.financesReducer,
}
