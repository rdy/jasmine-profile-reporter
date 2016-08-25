function ProfileReporter(options) {
  const records = {};
  const suiteRecords = {};
  /* eslint-disable no-console */
  const print = options.print || function(...args) { console.log(...args); };
  /* eslint-disable no-console */
  const onComplete = options.onComplete || function() {};

  this.specStarted = function() {
    this.specStartTime = Date.now();
  };
  this.specDone = function(result) {
    const seconds = (Date.now() - this.specStartTime) / 1000;
    records[result.id] = [result, seconds];
  };
  this.suiteStarted = function() {
    this.suiteStartTime = Date.now();
  };
  this.suiteDone = function(result) {
    const seconds = (Date.now() - this.suiteStartTime) / 1000;
    suiteRecords[result.id] = [result, seconds];
  };

  function objectValues(object) {
    const values = [];
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        values.push(object[key]);
      }
    }
    return values;
  }

  function reportSpecTiming() {
    print('10 slowest specs');
    print('spec time (seconds): full spec name');

    print(objectValues(records).sort(function(a, b) {
      return b[1] - a[1];
    }).slice(0, 10).map(function(record) {
      return '' + record[1] + ': ' + record[0].fullName;
    }).join('\n'));
  }

  function reportSuiteTiming() {
    print('10 slowest describes');
    print('suite time (seconds): full describe name');

    print(objectValues(suiteRecords).sort(function(a, b) {
      return b[1] - a[1];
    }).slice(0, 10).map(function(record) {
      return '' + record[1] + ': ' + record[0].fullName;
    }).join('\n'));
  }

  this.jasmineDone = function() {
    print('');
    reportSpecTiming();
    print('');
    reportSuiteTiming();
    print('');
    onComplete();
  };

  return this;
}

module.exports = ProfileReporter;