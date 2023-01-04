import { JsPsychData } from 'jspsych/dist/modules/data';
import { DataCollection } from 'jspsych/dist/modules/data/DataCollection';
import { getStageCompletionMessage } from '../shared/experiments';
import { uploadExperimentResults } from '../shared/firebase';

function getResultsFilename(task: string, participantId: string) {
  return `${task}_${participantId}_${Date.now()}.csv`;
}

const getStageCompletionMessageHTML = () => {
  return `<div>${getStageCompletionMessage()}</div>`;
};

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

export const storeExperimentResults = async (results: {
  participantId: string;
  task: string;
  data: DataCollection;
}) => {
  const { participantId, task, data } = results;
  const filename = getResultsFilename(task, participantId);
  data.localSave('csv', filename);
  console.log('Saved results locally as', filename);
  const csvString = data.csv();
  await uploadExperimentResults(filename, csvString);
  console.log('Uploaded results to Firebase as', filename);
  return;
};
