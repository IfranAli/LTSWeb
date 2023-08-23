import {createAction, props} from "@ngrx/store";
import {UserDatabaseModel} from "../models/user.interface";
import { UserStatusResponse } from "../services/user.service";

export const loginUser = createAction(
  'Login user action', props<UserStatusResponse>()
);

export const logoutUser = createAction(
  'Logout user action'
);
