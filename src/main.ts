import { initJsPsych } from 'jspsych';
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import imageKeyboardResponse from '@jspsych/plugin-image-keyboard-response';
import jsPsychPreload from '@jspsych/plugin-preload';

const jsPsych = initJsPsych({
  on_finish: () => jsPsych.data.displayData(),
});

const preload = {
  type: jsPsychPreload,
  images: ['img/blue.png', 'img/orange.png'],
};

const welcome = {
  type: htmlKeyboardResponse,
  stimulus: 'Welcome to the experiment. Press any key to begin.',
};

const instructions = {
  type: htmlKeyboardResponse,
  stimulus: `
    <p>In this experiment, a circle will appear in the center 
    of the screen.</p><p>If the circle is <strong>blue</strong>, 
    press the letter F on the keyboard as fast as you can.</p>
    <p>If the circle is <strong>orange</strong>, press the letter J 
    as fast as you can.</p>
    <div style='width: 700px;'>
    <div style='float: left;'><img src='img/blue.png'></img>
    <p class='small'><strong>Press the F key</strong></p></div>
    <div style='float: right;'><img src='img/orange.png'></img>
    <p class='small'><strong>Press the J key</strong></p></div>
    </div>
    <p>Press any key to begin.</p>
  `,
  post_trial_gap: 2000,
};

const test_stimuli = [
  { stimulus: 'img/blue.png', correct_response: 'f' },
  { stimulus: 'img/orange.png', correct_response: 'j' },
];

const fixation = {
  type: htmlKeyboardResponse,
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: 'NO_KEYS', // makes trial last until duration is over no matter the input
  trial_duration: () =>
    jsPsych.randomization.sampleWithoutReplacement(
      [250, 500, 750, 1000, 1250, 1500, 1750, 2000],
      1 // number of samples
    )[0],
};

const test = {
  type: imageKeyboardResponse,
  stimulus: jsPsych.timelineVariable('stimulus'),
  choices: ['f', 'j'],
  data: {
    // here we can store arbitrary additional data that will help us in data processing
    task: 'response',
    correct_response: jsPsych.timelineVariable('correct_response'),
  },
  on_finish: (data: any) => {
    data.correct = jsPsych.pluginAPI.compareKeys(
      // advantage of using this function: case insensitive by default!
      data.response,
      data.correct_response
    );
  },
};

const test_procedure = {
  timeline: [fixation, test],
  timeline_variables: test_stimuli,
  randomize_order: true,
  repetitions: 5,
};

jsPsych.run([preload, welcome, instructions, test_procedure]);
