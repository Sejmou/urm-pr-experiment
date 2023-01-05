import {
  endExperiment,
  getExperimentState,
  nextStage,
  runCurrentExperiment,
} from '../shared/experiment';

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
  await endExperiment();
}

main();
