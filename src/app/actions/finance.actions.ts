import {createAction, props} from "@ngrx/store";
import {IdentityInterface} from "../models/Identity.interface";
import {TaskModel} from "../models/task.model";
import {FinanceDatabaseModel, FinanceDatabaseModels, FinanceModelPublic} from "../finance/models/finance.model";

export const createFinance = createAction(
  'Create finance action', props<FinanceModelPublic>()
);

export const updateFinance = createAction(
  'Update finance action', props<FinanceDatabaseModel>()
);

export const deleteFinance = createAction(
  'Delete finance action', props<IdentityInterface>()
);

export const loadFinances = createAction(
  'Load finance action', props<FinanceDatabaseModels>()
);

export const addTaskToFinance = createAction(
  'Add Task action', props<Partial<TaskModel>>()
);
