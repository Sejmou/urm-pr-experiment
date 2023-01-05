import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './Home';
import { getParticipants, ParticipantData } from './shared/firebase';
import { resetQueryParams, setQueryParams } from './shared/utils';

async function main() {
  cleanUrl();
  const stats = await getParticipantStats();
  pickExperimentGroup(stats);

  await renderPage();
}

/**
 * Removes anything after the last slash in the page URL (exccept for query params)
 */
function cleanUrl() {
  if (window.location.pathname.split('/').pop() !== '') {
    window.location.pathname = '';
  }
}

async function getParticipantStats() {
  const [startedMusic, startedSilence, completedMusic, completedSilence] =
    await Promise.all([
      getParticipants('started', 'music'),
      getParticipants('started', 'silence'),
      getParticipants('completed', 'music'),
      getParticipants('completed', 'silence'),
    ]);
  const data = {
    music: { started: startedMusic, completed: completedMusic },
    silence: { started: startedSilence, completed: completedSilence },
  };

  console.log('participant data', data);

  const getUnfinished = (data: {
    started: ParticipantData[];
    completed: ParticipantData[];
  }) => {
    const { started, completed } = data;
    return started.filter(
      s => !completed.find(c => c.participantId === s.participantId)
    );
  };

  const getStartedWithinGivenMinutes = (
    data: ParticipantData[],
    minutes: number
  ) => data.filter(d => d.timestamp > Date.now() - minutes * 60 * 1000);

  const getInProgress = (data: {
    started: ParticipantData[];
    completed: ParticipantData[];
  }) => {
    const unfinished = getUnfinished(data);
    const inProgress = getStartedWithinGivenMinutes(unfinished, 20);
    return inProgress;
  };

  const stats = {
    music: {
      completed: data.music.completed.length,
      inProgress: getInProgress(data.music).length,
    },
    silence: {
      completed: data.silence.completed.length,
      inProgress: getInProgress(data.silence).length,
    },
  };

  console.log('stats', stats);

  return stats;
}

function pickExperimentGroup(
  stats: Awaited<ReturnType<typeof getParticipantStats>>
) {
  const { music, silence } = stats;
  const musicTotal = music.completed + music.inProgress;
  const silenceTotal = silence.completed + silence.inProgress;
  resetQueryParams();
  if (musicTotal < silenceTotal) {
    setQueryParams({ music: 'true' });
  }
}

async function renderPage() {
  ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
    <React.StrictMode>
      <Home />
    </React.StrictMode>
  );
}

main();
