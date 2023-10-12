import { createFinanceModel, FinanceModel } from "../models/finance.model";

export const dateToString = function (date: Date, seperator = "/"): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");

  return y + seperator + m + seperator + d;
};

const regExPatternTime: RegExp = /(\d{1,2}):(\d{2})/;
export const bulkImportTextToFinanceModel = (
  inputText: string,
  date: string = ""
): FinanceModel[] =>
  inputText
    .split("\n")
    .map((value) => {
      // Extract time component
      let timeStr = "";
      if (value.indexOf("@") > -1) {
        [value, timeStr] = value.split("@");

        const regexResult = regExPatternTime.test(timeStr);
        timeStr = regexResult ? timeStr : "";
      }

      // Extract name and amount
      const name = value.substring(value.indexOf(" ")).trim();
      const amount = parseFloat(value.substring(0, value.indexOf(" ")).trim());

      return createFinanceModel({
        name: name,
        amount: amount,
        date: date ?? "",
        time: timeStr,
      });
    })
    .filter(
      (model) => model.name.length > 0 && (model.amount > 0 || model.amount < 0)
    );

export const sortFinanceModels = (a: FinanceModel, b: FinanceModel) => {
  if (a.date == b.date) {
    if (a.amount == b.amount) {
      return 0;
    } else {
      return a.amount < b.amount ? -1 : 1;
    }
  } else {
    return new Date(a.date) > new Date(b.date) ? -1 : 1;
  }
};
