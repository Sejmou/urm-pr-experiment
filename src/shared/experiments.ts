import {
  addQueryParams,
  generateUUID,
  getQueryParam,
  setQueryParams,
} from './utils';

export const experiments = [
  {
    displayName: 'Experiment 0',
    run: async () => {
      const module = await import('../experiments/jsexample');
      return module.default();
    },
  },
  {
    displayName: 'Experiment 1',
    run: async () => {
      const module = await import('../experiments/example');
      return module.default();
    },
  },
];

export const startExperiments = () => {
  const participantId = getQueryParam('participantId') || generateUUID();
  setQueryParams({ participantId, currentStage: '1' });
  window.location = ('experiments/' +
    window.location.search) as unknown as Location;
};

export const endExperiments = () => {
  //resetQueryParams();
  window.location = '..' as unknown as Location;
};

export const getExperimentState = () => {
  if (getQueryParam('done') === 'true') return 'done';
  if (
    getCurrentStage() < 1 ||
    getCurrentStage() > experiments.length ||
    !getQueryParam('participantId')
  )
    return 'invalid';
  return 'in progress';
};

export const nextStage = () => {
  const currentStage = getCurrentStage();
  const nextStage = currentStage + 1;
  const done = nextStage > experiments.length;
  if (!done) {
    addQueryParams({ currentStage: nextStage.toString() });
  } else {
    addQueryParams({ done: 'true' });
  }
};

export const runCurrentExperiment = async () => {
  const currentStage = getCurrentStage();
  const i = currentStage - 1;
  await experiments[i].run();
};

export const getCurrentStage = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return +(searchParams.get('currentStage') || 0);
};
