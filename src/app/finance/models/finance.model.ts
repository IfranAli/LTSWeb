import {createEntityAdapter} from "@ngrx/entity";
import {IdentityInterface} from "../../models/Identity.interface";

export interface FinanceDatabaseModel {
  id: number,
  name: string,
  date: string,
  amount: number,
  categoryType: number,
}

export interface FinanceModel extends IdentityInterface, FinanceDatabaseModel {
}

export const defaultFinance: FinanceModel = {
  id: -1,
  name: '',
  date: '',
  amount: 0,
  categoryType: 0,
}

export function isValidFinance(finance: FinanceModel): boolean {
  return finance.id >= 0
}

export interface FinanceModelPublic {
  name: string,
  date: string,
  amount: number,
  categoryType: number,
}

export interface FinanceDatabaseModels {
  entities: FinanceModel[];
}

export const financeAdapter = createEntityAdapter<FinanceModel>();

export function createFinanceModel(
  model: Partial<FinanceModel> = {},
  defaultVar: FinanceModel = defaultFinance
): FinanceModel {
  return {
    id: model.id ?? defaultVar.id,
    name: model.name ?? defaultVar.name,
    date: model.date ?? defaultVar.date,
    amount: model.amount ?? defaultVar.amount,
    categoryType: model.categoryType ?? defaultVar.categoryType,
  }
}

