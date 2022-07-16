function createStatementData(invoice, plays) {
  const statementData = new Map();

  statementData.set('customer', invoice.customer);
  statementData.set(
    'performances',
    invoice.performances.map(enrichPerformance)
  );
  statementData.set('totalAmount', totalAmount(statementData));
  statementData.set('totalVolumeCredits', totalVolumeCredits(statementData));

  return statementData;

  function enrichPerformance(aPerformance) {
    const result = aPerformance;
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);

    return result;
  }

  function volumeCreditsFor(aPerformance) {
    let result = Math.max(aPerformance.audience - 30, 0);

    // add extra credit for every ten comedy attendees
    if ('comedy' === playFor(aPerformance).type)
      result += Math.floor(aPerformance.audience / 5);

    return result;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
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

  function totalAmount(data) {
    let result = 0;

    for (let perf of data.get('performances')) {
      result += perf.amount;
    }

    return result;
  }

  function totalVolumeCredits(data) {
    let volumeCredits = 0;

    for (let perf of data.get('performances')) {
      // add volume credits
      volumeCredits += perf.volumeCredits;
    }

    return volumeCredits;
  }
}

module.exports = createStatementData;
