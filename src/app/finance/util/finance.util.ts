import {createFinanceModel, FinanceModel} from "../models/finance.model";

export const dateToString = function (date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');

  return y + '/' + m + '/' + d;
}

export const bulkImportTextToFinanceModel =
  function (inputText: string, date: string = ''): FinanceModel[] {
    return inputText.split('\n')
      .map(value => {
          const n = value.substring(0, value.indexOf(' ') ?? 0)
          const d = value.substring(n.length).trim();
          const v = parseFloat(n);

          return createFinanceModel({
            name: d ?? '',
            amount: v ?? 0,
            date: date ?? '',
          })
        }
      ).filter(model => model.name.length > 0 && model.amount != 0);
  }
