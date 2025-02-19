import { centsToDollar } from "../../scripts/utils/money.js";

describe('Test suite: centsToDollar', () => {
  describe(('Basic cases: '), () => {
    it('Converts cents into dollars 1', () => {
      expect(centsToDollar(2095)).toEqual('20.95');
    });
    it('Converts cents into dollars 2', () => {
      expect(centsToDollar(9999)).toEqual('99.99');
    });
  });

  describe('Edge cases: ', () => {
    it('Works with 0', () => {
      expect(centsToDollar(0)).toEqual('0.00');
    });
    it('Rounds up to the nearest cent', () => {
      expect(centsToDollar(8000.5)).toEqual('80.01');
    });
  });
  
});