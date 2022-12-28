import {createAction, props} from "@ngrx/store";
import {UserDatabaseModel} from "../models/user.interface";

export const loginUser = createAction(
  'Login user action', props<UserDatabaseModel>()
);

export const logoutUser = createAction(
  'Logout user action'
);
