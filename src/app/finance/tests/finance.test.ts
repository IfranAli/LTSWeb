import {
  bulkImportTextToFinanceModel,
  dateToString,
} from "../util/finance.util";
import { parseDateIdentifierAsString } from "../../calendar/models/calendar.util";
import { getFinanceModelsFromInputBulk } from "../components/import-finance-dialog/import-finance-dialog.component";

const input =
  "-10 Broccoli\n" +
  "-30.3 Kale\n" +
  "-60 Onion\n" +
  "-23.2 Sprouts\n" +
  "-33.8 Onion\n" +
  "-20 Beer\n" +
  "-10.5 Ice Cream\n" +
  "-100 Bread";

describe("Finance Tests", () => {
  it("Should import expenses into Finance models", () => {
    const result = bulkImportTextToFinanceModel(input);
    const total = result.reduce((carry, item) => {
      return carry + item.amount;
    }, 0);

    expect(result.length).toBe(8);
    expect(total).toBe(-287.8);
  });

  it("Should parse finance data tagged with date heading", () => {
    const data =
      "Expenses\n\nJan 12-10 Broccoli\n\nFeb 13\n-20 Kale\n-25 Onion\n";

    const models = data
      .split("\n\n")
      .map((m) => {
        const items = m.split("\n");

        if (items.length < 2) {
          return null;
        }

        const dateStr = parseDateIdentifierAsString(items[0]);

        if (dateStr.length) {
          const itemsSlice = items.slice(1).join("\n").trim();
          return bulkImportTextToFinanceModel(itemsSlice, dateStr);
        }

        return bulkImportTextToFinanceModel(input, dateToString(new Date()));
      })
      .flatMap((v) => v)
      .filter((v) => v!!);
  });

  it("Should parse finance data tagged with time", () => {
    const input = "Sep 01 2023\n" + "-20.5 Pizza  @19:24";
    const processed = getFinanceModelsFromInputBulk(input);

    const item = processed[0];
    expect(processed.length).toBe(1);
    expect(item.date).toBe("2023/09/01");
    expect(item.name).toBe("Pizza");
    expect(item.amount).toBe(-20.5);
    expect(item.time).toBe("19:24");
  });
});
