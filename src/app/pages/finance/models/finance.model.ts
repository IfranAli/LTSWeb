import { IdentityInterface } from "../../../models/Identity.interface";

export interface FinanceDatabaseModel {
  id: number;
  accountId: number;
  name: string;
  date: string;
  amount: number;
  categoryType: number;
}

export interface FinanceCategory extends IdentityInterface {
  type: string;
  colour: string;
}

export interface FinanceModel extends IdentityInterface, FinanceDatabaseModel {}

export const defaultFinance: FinanceModel = {
  id: -1,
  accountId: 0,
  name: "",
  date: "",
  amount: 0,
  categoryType: 0,
};

export function isValidFinance(finance: FinanceModel): boolean {
  return finance.id >= 0;
}

export interface FinanceModelPublic {
  name: string;
  date: string;
  amount: number;
  categoryType: number;
}

export interface FinanceDatabaseModels {
  entities: FinanceModel[];
}

export function createFinanceModel(
  model: Partial<FinanceModel> = {},
  defaultVar: FinanceModel = defaultFinance
): FinanceModel {
  return {
    id: model.id ?? defaultVar.id,
    accountId: model.accountId ?? defaultVar.accountId,
    name: model.name ?? defaultVar.name,
    date: model.date ?? defaultVar.date,
    amount: model.amount ?? defaultVar.amount,
    categoryType: model.categoryType ?? defaultVar.categoryType,
  };
}
