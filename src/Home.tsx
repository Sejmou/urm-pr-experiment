import './Home.css';
import { tasks, startExperiment } from './shared/experiment';

function Home() {
  return (
    <div className="App">
      <h1>URM PR Experiment</h1>
      <div className="card">
        <p>Welcome to our experiment. It consists of several stages:</p>
        <ol>
          {tasks.map((p, i) => (
            <li key={i}>
              {p.displayName}
              {/* <a href={`./${p.path}/`}>{p.displayName}</a> */}
            </li>
          ))}
        </ol>
        <br />
        <p>Once you feel ready, click the button below to get started!</p>
        <button onClick={startExperiment}>Start</button>
      </div>
    </div>
  );
}

export default Home;
