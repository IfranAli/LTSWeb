import {createFeatureSelector, createReducer, on} from '@ngrx/store';
import {createFinance, deleteFinance, loadFinances, updateFinance} from "../actions/finance.actions";
import {createFinanceModel, financeAdapter, FinanceModel} from "../finance/models/finance.model";

export interface FinanceState {
  ids: [],
  entities: {}
}

const defaultFinance: FinanceState = {
  entities: {},
  ids: []
}

const initialFinanceState = financeAdapter.getInitialState(defaultFinance);
export const selectFinanceState = createFeatureSelector<FinanceState>('finances');

export const {
  selectIds,
  selectEntities
} = financeAdapter.getSelectors(selectFinanceState);

export const financesReducer = createReducer(
  initialFinanceState,
  on(loadFinances, (state, payload) => {
    return financeAdapter.addMany(payload.entities, state);
  }),
  on(createFinance, (state, payload: Partial<FinanceModel>) => {
    return financeAdapter.addOne({...createFinanceModel(payload)}, state)
  }),
  on(updateFinance, (state, payload: Partial<FinanceModel>) => {
    return financeAdapter.updateOne({
      changes: {
        ...createFinanceModel(payload),
      },
      id: payload.id!
    }, state);
  }),
  on(deleteFinance, (state) => {
    return state;
  }),
);
