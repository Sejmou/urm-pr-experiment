import {
  addQueryParams,
  generateUUID,
  getQueryParam,
  setQueryParams,
} from './utils';
import { storeExperimentStart, storeExperimentCompletion } from './firebase';

export const tasks = [
  {
    displayName: 'Digit Span Task',
    run: async () => {
      const module = await import('../tasks/digit_span');
      return module.default();
    },
  },
  {
    displayName: 'Symmetry Span Task',
    run: async () => {
      const module = await import('../tasks/symmetry_span');
      return module.default();
    },
  },
];

export const getParticipantId = () => {
  const participantId = getQueryParam('participantId');
  if (!participantId) throw new Error('No participantId');
  return participantId;
};

export const startExperiment = async () => {
  const participantId = getQueryParam('participantId') || generateUUID();
  await storeExperimentStart(
    participantId,
    isMusicTestGroup() ? 'music' : 'silence'
  );
  const params: { [key: string]: string } = {
    participantId,
    currentStage: '1',
  };
  if (isMusicTestGroup()) params.music = 'true';
  setQueryParams(params);
  window.location = ('tasks/' + window.location.search) as unknown as Location;
};

export const isMusicTestGroup = () => {
  return getQueryParam('music') !== null;
};

export const endExperiment = async () => {
  await storeExperimentCompletion(
    getParticipantId(),
    isMusicTestGroup() ? 'music' : 'silence'
  );
  window.location = ('..' +
    (isMusicTestGroup() ? '/?music=true' : '')) as unknown as Location;
};

export const getExperimentState = () => {
  if (getQueryParam('done') === 'true') return 'done';
  if (
    getCurrentStage() < 1 ||
    getCurrentStage() > tasks.length ||
    !getQueryParam('participantId')
  )
    return 'invalid';
  return 'in progress';
};

export const nextStage = () => {
  const currentStage = getCurrentStage();
  const nextStage = currentStage + 1;
  const done = nextStage > tasks.length;
  if (!done) {
    addQueryParams({ currentStage: nextStage.toString() });
  } else {
    addQueryParams({ done: 'true' });
  }
};

export const runCurrentExperiment = async () => {
  const currentStage = getCurrentStage();
  const i = currentStage - 1;
  await tasks[i].run();
};

export const getCurrentStage = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return +(searchParams.get('currentStage') || 0);
};

export const getStageCompletionMessage = () => {
  const currentStage = getCurrentStage();
  const totalStages = tasks.length;
  if (currentStage === totalStages)
    return 'You have completed all stages of the experiment!\nClick the button below to finish.';
  const remainingStages = totalStages - currentStage;
  return `You have completed stage ${currentStage} of ${totalStages}. Only ${remainingStages} more stage${
    remainingStages == 1 ? '' : 's'
  } to go!`;
};
