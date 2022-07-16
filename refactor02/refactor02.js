const createStatementData = require('./createStatementData');

function usd(aNumber) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}

function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));
}

module.exports = statement;

function renderPlainText(data) {
  let result = `Statement for ${data.get('customer')}\n`;

  // print line for this order
  for (let perf of data.get('performances')) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${
      perf.audience
    } seats)\n`;
  }

  // Append to result string
  result += `Amount owed is ${usd(data.get('totalAmount'))}\n`;
  result += `You earned ${data.get('totalVolumeCredits')} credits\n`;
  return result;
}
