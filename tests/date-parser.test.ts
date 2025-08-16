import { parseDateInput } from 'src/app/pages/calendar/date-parser.util';
import { dateToString } from 'src/app/util/date-util';

describe('Date parser tests', () => {
  test('parseDateIdentifier', () => {
    const currentYear = new Date().getFullYear();
    const inputAndOutput = [
      ['July 19', new Date(currentYear, 6, 19)],
      ['March 12', new Date(currentYear, 2, 12)],
      ['Jan 1 2020', new Date(2020, 0, 1)],
      ['July 03 2021', new Date(2021, 6, 3)],
      ['AUG 03 2024', new Date(2024, 7, 3)],
      ['03 APR 2023', new Date(2023, 3, 3)],
      ['12 DEC 2012', new Date(2012, 11, 12)],
    ];

    inputAndOutput.forEach((v) => {
      const input = v[0] as string;
      const expected = dateToString(v[1] as Date);
      const result = parseDateInput(input);
      expect(result).toEqual(expected);
    });
  });
});
