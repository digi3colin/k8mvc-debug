const fs = require('fs');
const {performance} = require('perf_hooks');
let benchmarkRecords = [];

module.exports = {
  benchmarkReset : ()=>{
    benchmarkRecords = [];
  },

  benchmark : (label) => {
    const currTime = performance.now();
    const deltaTime = (benchmarkRecords.length === 0) ? 0 : (currTime - benchmarkRecords[benchmarkRecords.length-1].time);
    benchmarkRecords.push({'label': label, 'time' : currTime, 'delta': deltaTime});
  },

  getBenchmarkRecords: ()=>{
    return benchmarkRecords;
  },
};