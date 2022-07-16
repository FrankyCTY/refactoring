class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  get amount() {
    throw new Error('subclass responsibility');
  }

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;

    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }

    result += 300 * this.performance.audience;
    return result;
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}

function createPerformanceCalculator(aPerformance, aPlay) {
  switch (aPlay.type) {
    case 'tragedy':
      return new TragedyCalculator(aPerformance, aPlay);

    case 'comedy':
      return new ComedyCalculator(aPerformance, aPlay);

    default:
      throw new Error(`unknown type: ${aPlay.type}`);
  }
}

function createStatementData(invoice, plays) {
  const result = new Map();

  result.set('customer', invoice.customer);
  result.set('performances', invoice.performances.map(enrichPerformance));
  result.set('totalAmount', totalAmount(result));
  result.set('totalVolumeCredits', totalVolumeCredits(result));

  return result;

  function enrichPerformance(aPerformance) {
    const calculator = createPerformanceCalculator(
      aPerformance,
      playFor(aPerformance)
    );

    const result = aPerformance;
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;

    return result;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
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
