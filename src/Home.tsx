import './Home.css';
import { tasks, startExperiment } from './shared/experiment';
import { useState } from 'react';
import { isMusicTestGroup } from './shared/experiment';

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

function Home() {
  const musicTestGroup = isMusicTestGroup();
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState('');
  const handleChange = () => {
    setChecked(!checked);
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleStartClick = () => {
    startExperiment(email);
  };

  return (
    <>
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
            <b>
              Please make sure you are in a quiet environment without any
              distractions.
              <br />A keyboard is required to complete the experiment, so
              unfortunately you cannot participate with your mobile phone.
            </b>
          </p>
          {musicTestGroup ? (
            <>
              <p>
                Below is a link to a music playlist. Click it and make sure you
                can hear the music clearly, then return to this screen. You
                should keep the music playing for the whole experiment.
              </p>
              <a
                className="music-link"
                href="https://youtu.be/CLeZyIID9Bo?t=1"
                target="_blank"
              >
                Chill music
              </a>
              <p>
                Please,{' '}
                <b>
                  do not start the experiment if you can't listen to the music!
                </b>
              </p>
            </>
          ) : (
            ''
          )}
          <p>
            In case you are interested in your results or outcomes of this
            experiment in general, feel free to enter your email below. We might
            reach out to you with the results once the experiment is over. You
            can also leave the field empty, then you are 100% anonymous and only
            data about your task performance is collected.
          </p>
          <input
            className="email-input"
            type="email"
            placeholder="Your email (optional)"
            value={email}
            onChange={handleEmailChange}
          />
          <p>
            It is very important that you follow the instructions above
            carefully!
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
            onClick={handleStartClick}
          >
            Start
          </button>
        </div>
      </div>
      <a className="about-link" href="/about/">
        About
      </a>
    </>
  );
}

export default Home;
