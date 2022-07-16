const createStatementData = require('./createStatementData');

function usd(aNumber) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}

function statement(invoice, plays) {
  console.log(renderHtml(createStatementData(invoice, plays)));
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

function renderHtml(data) {
  let result = `<h1>Statement for ${data.get('customer')}</h1>\n`;
  result += '<table>\n';
  result += '<tr><th>play</th><th>seats</th><th>cost</th></tr>';
  for (let perf of data.get('performances')) {
    result += ` <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
    result += `<td>${usd(perf.amount)}</td></tr>\n`;
  }
  result += '</table>\n';
  result += `<p>Amount owed is <em>${usd(data.get('totalAmount'))}</em></p>\n`;
  result += `<p>You earned <em>${data.get(
    'totalVolumeCredits'
  )}</em> credits</p>\n`;
  return result;
}
