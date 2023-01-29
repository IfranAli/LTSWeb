import {bulkImportTextToFinanceModel} from "../util/finance.util";

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

})
