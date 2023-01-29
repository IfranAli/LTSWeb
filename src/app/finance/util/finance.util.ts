import {createFinanceModel, FinanceModel} from "../models/finance.model";

export const bulkImportTextToFinanceModel = function (inputText: string): FinanceModel[] {
  return inputText.split('\n')
    .map(value => {
        const n = value.substring(0, value.indexOf(' ') ?? 0)
        const d = value.substring(n.length).trim();
        const v = parseFloat(n);

        return createFinanceModel({
          name: d ?? '',
          amount: v ?? 0,
        })
      }
    ).filter(model => model.name.length > 0 && model.amount != 0);
}
