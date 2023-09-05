import {createFinanceModel, FinanceModel} from "../models/finance.model";

export const dateToString = function (date: Date, seperator = '/'): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');

  return y + seperator + m + seperator + d;
}

export const bulkImportTextToFinanceModel = (inputText: string, date: string = ''): FinanceModel[] =>
  inputText.split('\n')
    .map(value => {
        const n = value.substring(0, value.indexOf(' ') ?? 0)
        const d = value.substring(n.length).trim();
        const v = parseFloat(n) ?? 0;

        return createFinanceModel({
          name: d ?? '',
          amount: v ?? 0,
          date: date ?? '',
        })
      }
    ).filter(model => model.name.length > 0 && (model.amount > 0 || model.amount < 0)
  );

export const sortFinanceModels = (a: FinanceModel, b: FinanceModel) => {
  if (a.date == b.date) {

    if (a.amount == b.amount) {
      return 0
    } else {
      return (a.amount < b.amount) ? -1 : 1;
    }

  } else {
    return (new Date(a.date) > new Date(b.date)) ? -1 : 1;
  }
}
