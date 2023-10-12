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

const importText = `feb 5
-12.0 breakfast@11:30
-5 coffee@9:00
-33.8 Onion
-20 Beer
-10.5 Ice Cream

apr 12
-15 transport@13:00
-100 Bread"

may 1
-8 choclates@15:00
-10 Broccoli
-30.3 Kale
-60 Onion
-23.2 Sprouts
  `;

describe("Finance Tests", () => {
  it("Should import expenses into Finance models", () => {
    const result = bulkImportTextToFinanceModel(input);
    const total = result.reduce((carry, item) => {
      return carry + item.amount;
    }, 0);

    expect(result.length).toBe(8);
    expect(total).toBe(-287.8);
  });

  it("Should parse finance data tagged with date and time", () => {
    const processed = getFinanceModelsFromInputBulk(importText);

    expect(processed.length).toBe(12);

    const item = processed[0];
    expect(item.name).toBe("breakfast");
    expect(item.amount).toBe(-12);
    expect(item.time).toBe("11:30");

    const item2 = processed[4];
    expect(item2.name).toBe("Ice Cream");
    expect(item2.amount).toBe(-10.5);
    expect(item2.date).toBe("2023/02/05");

    const item3 = processed[5];
    expect(item3.name).toBe("transport");
    expect(item3.amount).toBe(-15);
    expect(item3.date).toBe("2023/04/12");
    expect(item3.time).toBe("13:00");
  });
});
