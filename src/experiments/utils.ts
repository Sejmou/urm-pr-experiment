import { getStageCompletionMessage } from '../shared/experiments';

export function getResultsFilename(task: string, participantId: string) {
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
