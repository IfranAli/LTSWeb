import { createFinanceModel, FinanceModel } from "../models/finance.model";

export const dateToString = function (date: Date, seperator = "/"): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");

  return y + seperator + m + seperator + d;
};

const regExPatternTime: RegExp = /@(\d{2}):(\d{2})/g;
export const bulkImportTextToFinanceModel = (
  inputText: string,
  date: string = ""
): FinanceModel[] =>
  inputText
    .split("\n")
    .map((value) => {
      const items = value
        .split(" ")
        .map((v) => v.trim())
        .filter((v) => v.length > 0);
      const amount = parseFloat(items.at(0) ?? "");
      const name = items.at(1) ?? "";
      const time = items.find((v) => {
        return regExPatternTime.test(v);
      })?.slice(1) ?? "";

      return createFinanceModel({
        name: name,
        amount: amount,
        date: date ?? "",
        time: time,
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
