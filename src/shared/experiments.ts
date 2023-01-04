import {
  addQueryParams,
  generateUUID,
  getQueryParam,
  setQueryParams,
} from './utils';

export const experiments = [
  {
    displayName: 'Digit Span Task',
    run: async () => {
      const module = await import('../experiments/digit_span');
      return module.default();
    },
  },
  {
    displayName: 'Symmetry Span Task',
    run: async () => {
      const module = await import('../experiments/symmetry_span');
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

export const getParticipantId = () => {
  const participantId = getQueryParam('participantId');
  if (!participantId) throw new Error('No participantId');
  return participantId;
};

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

export const getStageCompletionMessage = () => {
  const currentStage = getCurrentStage();
  const totalStages = experiments.length;
  if (currentStage === totalStages)
    return 'You have completed all stages of the experiment!';
  const remainingStages = totalStages - currentStage;
  return `You have completed stage ${currentStage} of ${totalStages}. Only ${remainingStages} more stage${
    remainingStages == 1 ? '' : 's'
  } to go!`;
};
