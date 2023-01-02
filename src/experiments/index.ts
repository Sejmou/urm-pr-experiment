import {
  endExperiments,
  getExperimentState,
  nextStage,
  runCurrentExperiment,
} from '../shared/experiments';

async function main() {
  while (true) {
    const state = getExperimentState();
    if (state === 'in progress') {
      await runCurrentExperiment();
      nextStage();
    } else {
      if (state == 'done') {
        alert('Thank you for participating!');
      }
      break;
    }
  }
  endExperiments();
}

main();
