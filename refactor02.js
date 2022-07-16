const plays = require('./plays.json');

function enrichPerformance(aPerformance) {
  const result = aPerformance;
  result.play = playFor(result);
  result.amount = amountFor(result);
  result.volumeCredits = volumeCreditsFor(result);

  return result;
}

function usd(aNumber) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}

function volumeCreditsFor(aPerformance) {
  let result = Math.max(aPerformance.audience - 30, 0);

  // add extra credit for every ten comedy attendees
  if ('comedy' === playFor(aPerformance).type)
    result += Math.floor(aPerformance.audience / 5);

  return result;
}

function amountFor(aPerformance) {
  let result = 0;
  switch (playFor(aPerformance).type) {
    case 'tragedy':
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
    case 'comedy':
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
  return result;
}

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

function statement(invoice, plays) {
  // Phase 1 - Get statement data
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);

  return renderPlainText(statementData, invoice);

  function totalAmount(data) {
    let result = 0;

    for (let perf of data.performances) {
      result += perf.amount;
    }

    return result;
  }

  function totalVolumeCredits(data) {
    let volumeCredits = 0;

    for (let perf of data.performances) {
      // add volume credits
      volumeCredits += perf.volumeCredits;
    }

    return volumeCredits;
  }
}

module.exports = statement;

function renderPlainText(data) {
  let result = `Statement for ${data.customer}\n`;

  // print line for this order
  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(amountFor(perf))} (${
      perf.audience
    } seats)\n`;
  }

  // Append to result string
  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;
}
