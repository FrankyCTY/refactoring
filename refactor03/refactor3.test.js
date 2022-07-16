const statement = require('./refactor03js');
const plays = require('../plays.json');
const invoices = require('../invoices.json');

test('refactor03', () => {
  return expect(statement(invoices[0], plays)).toBe(`Statement for BigCo
 Hamlet: $650.00 (55 seats)
 As You Like It: $580.00 (35 seats)
 Othello: $500.00 (40 seats)
Amount owed is $1,730.00
You earned 47 credits
`);
});
