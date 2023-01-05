import './Home.css';
import { tasks, startExperiment } from './shared/experiment';
import { useState } from 'react';
import { isMusicTestGroup } from './shared/experiment';
import { getParticipants, ParticipantData } from './shared/firebase';

async function logParticipantStats() {
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

  console.log(data);

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
}

logParticipantStats();

type CheckboxProps = {
  label: string;
  value: boolean;
  onChange: () => void;
};

const Checkbox = ({ label, value, onChange }: CheckboxProps) => {
  return (
    <label>
      <input type="checkbox" checked={value} onChange={onChange} />
      {label}
    </label>
  );
};

const musicTestGroup = isMusicTestGroup();

function Home() {
  const [checked, setChecked] = useState(false);
  const handleChange = () => {
    setChecked(!checked);
  };

  return (
    <div className="App">
      <h1>Super Awesome Experiment</h1>
      <div className="card">
        <p>
          Welcome to our experiment! Thank you for taking the time to
          participate in it. You should be done after roughly 15 minutes. The
          experiment consists of the following stages:
        </p>
        <ol>
          {tasks.map((p, i) => (
            <li key={i}>
              {p.displayName}
              {/* <a href={`./${p.path}/`}>{p.displayName}</a> */}
            </li>
          ))}
        </ol>
        <p>
          Make sure you are in a quiet environment without any distractions. We
          will only collect anonymized performance data, no results will be
          traceable back to you.
        </p>
        {musicTestGroup ? (
          <>
            <p>
              Below is a link to a music playlist. Click it and make sure you
              can hear the music clearly, then return to this screen. You should
              keep the music playing for the whole experiment.
            </p>
            <a
              className="music-link"
              href="https://youtu.be/CLeZyIID9Bo"
              target="_blank"
            >
              Chill music
            </a>
          </>
        ) : (
          ''
        )}
        <p>
          It is very important that you follow these instructions carefully!
        </p>
        <Checkbox
          label="I have understood the instructions above and set up my environment accordingly."
          value={checked}
          onChange={handleChange}
        />
        <p>Once you feel ready, click the button below to get started!</p>
        <button
          className="center"
          disabled={!checked}
          onClick={startExperiment}
        >
          Start
        </button>
      </div>
    </div>
  );
}

export default Home;
