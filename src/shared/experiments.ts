export const experiments = [
  {
    displayName: 'Experiment 1',
    run: () => {
      import('../experiments/example').then(module => module.default());
    },
  },
];

export const startExperiments = () => {
  const participantId = getQueryParam('participantId') || generateUUID();
  setQueryParams({ participantId, currentStage: '1' });
  window.location = ('experiments/' +
    window.location.search) as unknown as Location;
};

export const nextStage = () => {
  const currentStage = getCurrentStage();
  setQueryParams({ currentStage: `${currentStage + 1}` });
  const done = currentStage + 1 > experiments.length;
  if (done) {
    window.location = ('..' +
      '?' +
      new URLSearchParams({ done: 'true' })) as unknown as Location;
  } else {
    experiments[currentStage].run();
  }
  return done;
};

export const experimentsInProgress = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return !!searchParams.get('participantId');
};

export const isExperimentDone = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return !!searchParams.get('done');
};

export const getCurrentStage = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return +(searchParams.get('currentStage') || 0);
};

function getQueryParam(key: string) {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(key);
}

function setQueryParams(params: { [key: string]: string }) {
  const searchParams = new URLSearchParams(window.location.search);
  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, value);
  }
  const newRelativePathQuery =
    window.location.pathname + '?' + searchParams.toString();
  history.pushState(null, '', newRelativePathQuery);
}

function generateUUID() {
  // Public Domain/MIT, https://stackoverflow.com/a/8809472/13727176
  var d = new Date().getTime(); //Timestamp
  var d2 =
    (typeof performance !== 'undefined' &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
