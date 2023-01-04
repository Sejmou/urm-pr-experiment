import { DataCollection } from 'jspsych/dist/modules/data/DataCollection';
import {
  getCurrentStage,
  getStageCompletionMessage,
} from '../shared/experiment';
import { uploadExperimentResults } from '../shared/firebase';
import seedrandom from 'seedrandom';

function getStageCompletionMessageHTML() {
  return `<div>${getStageCompletionMessage()}</div>`;
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
  data.localSave('csv', filename);
  console.log('Saved results locally as', filename);
  const csvString = data.csv();
  await uploadExperimentResults(filename, csvString);
  console.log('Uploaded results to Firebase as', filename);
  return;
}

function getResultsFilename(experimentTask: string, participantId: string) {
  return `${getCurrentStage()}_${experimentTask}_${participantId}_${Date.now()}.csv`;
}

/**
 * This could be called at the start of each task to ensure that the experiment is the same for each participant.
 *
 * Not sure if it's a good idea though lol
 */
export function setRandomSeed() {
  seedrandom('urm-pr-experiment', { global: true });
}
