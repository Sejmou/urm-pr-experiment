import { DataCollection } from 'jspsych/dist/modules/data/DataCollection';
import {
  getCurrentStage,
  getStageCompletionMessage,
  isMusicTestGroup,
} from '../shared/experiment';
import { uploadExperimentTaskResults } from '../shared/firebase';
import seedrandom from 'seedrandom';
import { firebaseActive } from '../shared/firebase';

function getStageCompletionMessageHTML() {
  return `<div>${getStageCompletionMessage().split('\n').join('<br>')}</div>`;
}

export function createConclusionMessageBlock() {
  return {
    type: 'instructions',
    pages: function () {
      return [getStageCompletionMessageHTML()];
    },
    allow_backward: false,
    button_label_next: 'Continue',
    show_clickable_nav: true,
  };
}

export async function storeTaskResults(results: {
  participantId: string;
  task: string;
  data: DataCollection;
}) {
  const { participantId, task, data } = results;
  const filename = getResultsFilename(task, participantId);

  if (firebaseActive) {
    const csvString = data.csv();
    await uploadExperimentTaskResults(filename, csvString);
  } else {
    // data.localSave('csv', filename);
    // console.log('Saved results locally as', filename);
  }
  return;
}

function getResultsFilename(experimentTask: string, participantId: string) {
  return `${
    isMusicTestGroup() ? 'music' : 'silence'
  }_${getCurrentStage()}_${experimentTask}_${participantId}_${Date.now()}.csv`;
}

/**
 * This could be called at the start of each task to ensure that the experiment is the same for each participant.
 *
 * Not sure if it's a good idea though lol
 */
export function setRandomSeed() {
  seedrandom('urm-pr-experiment', { global: true });
}
