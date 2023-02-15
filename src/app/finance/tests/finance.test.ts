import {bulkImportTextToFinanceModel, dateToString} from "../util/finance.util";
import {parseDateIdentifierAsString} from "../../calendar/models/calendar.util";

const input =
  '-10 Broccoli\n' +
  '-30.3 Kale\n' +
  '-60 Onion\n' +
  '-23.2 Sprouts\n' +
  '-33.8 Onion\n' +
  '-20 Beer\n' +
  '-10.5 Ice Cream\n' +
  '-100 Bread'

describe('Finance Tests', () => {

  it('Should import expenses into Finance models', () => {
    const result = bulkImportTextToFinanceModel(input);
    const total = result.reduce((p, c) => {
      return {...p, amount: p.amount + c.amount}
    });

    expect(result.length).toBe(8)
    expect(total).toBe(-287.8)
  });


  it('Should parse finance data tagged with date heading', () => {
    const data = "Expenses\n\nJan 12\-10 Broccoli\n\nFeb 13\n-20 Kale\n-25 Onion\n"

    const models = data.split('\n\n').map(m => {
      const items = m.split('\n');

      if (items.length < 2) {
        return null;
      }

      const dateStr = parseDateIdentifierAsString(items[0])

      if (dateStr.length) {
        const itemsSlice = items.slice(1).join('\n').trim();
        return bulkImportTextToFinanceModel(itemsSlice, dateStr);
      }

      return bulkImportTextToFinanceModel(input, dateToString(new Date()));
    }).flatMap(v => v).filter(v => v!!)

    console.log(models)
  });

})
