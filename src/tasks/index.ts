import {
  endExperiment,
  getExperimentState,
  nextStage,
  runCurrentExperiment,
} from '../shared/experiment';

// add event listener to prevent accidental page refresh or leaving of page during experiment
const beforeUnloadListener = (event: any) => {
  event.preventDefault();
  return (event.returnValue = 'Are you sure you want to exit?');
};
window.addEventListener('beforeunload', beforeUnloadListener, {
  capture: true,
});

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
  // remove event listener as otherwise user would be shown the "are you sure you want to leave" dialog even though they have completed the experiment
  window.removeEventListener('beforeunload', beforeUnloadListener, {
    capture: true,
  });
  await endExperiment();
}

main();
