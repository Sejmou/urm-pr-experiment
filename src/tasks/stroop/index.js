import '@lib/jspsych-6.2.0/jspsych.js';
import '@lib/jspsych-6.2.0/plugins/jspsych-html-keyboard-response.js';
import '@lib/jspsych-6.2.0/plugins/jspsych-image-keyboard-response.js';
import '@lib/jspsych-6.2.0/plugins/jspsych-instructions.js';
import '@lib/jspsych-6.2.0/plugins/jspsych-fullscreen.js';
import '@lib/jspsych-6.2.0/css/jspsych.css';
import keyboard_path from './StroopColorsKeyboard.png';
import { getParticipantId } from '../../shared/experiment';
import { createConclusionMessageBlock, storeTaskResults } from '../utils';

// CONFIG
var FullScreenMode = false;

var ColorWordInstrText = [
  '<p>Welcome to the Stroop Color/Word experiment.</p>',
  '<p>In this task, words will appear in the center of the screen. You need to indicate the COLOR that the word is written in (and ignore what the word says). Press the key that corresponds to that color, as shown in the figure. This figure will be present during the entire experiment.</p><img src="' +
    keyboard_path +
    '"></img>',
  '<p>Before doing the actual experiment you will complete some practice trials. These will give you feedback about your accuracy. <p>Remember to respond as accurately and quickly as possible.</p>',
];

var ColorWordInstrPoorPerformanceText = [
  '<p>There will be another run of practice trials with feedback.</p> <p>Remember to respond as accurately and quickly as possible.</p>',
];

var ColorWordTestInstrText = [
  '<p> You will now respond without any feedback. Try to respond as quickly and accurately as possible. </p>',
];

/* If the response choice get modified here they also need to be modified below
 */
var ResponseChoices = ['v', 'b', 'n', 'm', 27];

var FeedbackLength = 400; // This is in milliseconds

//var FixationLength = 500; // This is in milliseconds

var ColorWordPracticeRepeats = 2;

// Since there are 16 possible trials, the number of trials will be 4 times the number of repeats
var ColorWordTestRepeats = 4;

/* ========================================================= 
	This is a function for positioning the instruction figure and stimuli on the screen
	If the instruction keyboard mapping figure is too low change the 'height' value below.
*/

function PutIntoTable(
  top = 'top',
  middle = 'mid',
  width = 600,
  height = 300,
  img_path = keyboard_path
) {
  return (
    '<table border="0" width="' +
    width +
    '"><tr height="' +
    height +
    '"><td>' +
    top +
    '</td></tr><tr height="' +
    height +
    '">' +
    '<td><div style="font-size:60px;">' +
    middle +
    '</div></td></tr><tr height="' +
    height +
    '">' +
    '<td valign="bottom"><img src="' +
    keyboard_path +
    '"></td></tr></table>'
  );
}

/* ========================================================= 
	This is the stimuli list for stroop color/word
*/
var StroopColorWordList = [
  {
    Word: 'Red',
    Congruency: 'Con',
    letter: 'v',
    Color: '(255,0,0)',
  },
  {
    Word: 'Red',
    Congruency: 'Incon',
    letter: 'b',
    Color: '(255,255,0)',
  },
  {
    Word: 'Red',
    Congruency: 'Incon',
    letter: 'm',
    Color: '(0,0,255)',
  },
  {
    Word: 'Red',
    Congruency: 'Incon',
    letter: 'n',
    Color: '(0,255,0)',
  },
  {
    Word: 'Yellow',
    Congruency: 'Incon',
    letter: 'v',
    Color: '(255,0,0)',
  },
  {
    Word: 'Yellow',
    Congruency: 'Con',
    letter: 'b',
    Color: '(255,255,0)',
  },
  {
    Word: 'Yellow',
    Congruency: 'Incon',
    letter: 'm',
    Color: '(0,0,255)',
  },
  {
    Word: 'Yellow',
    Congruency: 'Incon',
    letter: 'n',
    Color: '(0,255,0)',
  },
  {
    Word: 'Blue',
    Congruency: 'Incon',
    letter: 'v',
    Color: '(255,0,0)',
  },
  {
    Word: 'Blue',
    Congruency: 'Incon',
    letter: 'b',
    Color: '(255,255,0)',
  },
  {
    Word: 'Blue',
    Congruency: 'Con',
    letter: 'm',
    Color: '(0,0,255)',
  },
  {
    Word: 'Blue',
    Congruency: 'Incon',
    letter: 'n',
    Color: '(0,255,0)',
  },
  {
    Word: 'Green',
    Congruency: 'Incon',
    letter: 'v',
    Color: '(255,0,0)',
  },
  {
    Word: 'Green',
    Congruency: 'Incon',
    letter: 'b',
    Color: '(255,255,0)',
  },
  {
    Word: 'Green',
    Congruency: 'Incon',
    letter: 'm',
    Color: '(0,0,255)',
  },
  {
    Word: 'Green',
    Congruency: 'Con',
    letter: 'n',
    Color: '(0,255,0)',
  },
];

// -------------------------------- EXPERIMENT --------------------------------
const experiment = new Promise(resolve => {
  const participantId = getParticipantId();

  /* create timeline */
  var timeline = [];
  // Make experiment run in full screen mode
  // Note, that the fullscreen plugin needs to imported above
  timeline.push({
    type: 'fullscreen',
    fullscreen_mode: FullScreenMode,
  });

  /* Create the initial welcome and instructions for practice.
This uses the built in instructions module. Make sure it gets imported above */
  var ColorWordInstr = {
    type: 'instructions',
    pages: ColorWordInstrText,
    show_clickable_nav: true,
  };
  /* After practice is completed the performance is being checked. If accuracy is below 50% then the practice is repeated.
 These are the instructions stating that practice will be repeated. */
  var ColorWordPoorPerfInstr = {
    type: 'instructions',
    pages: ColorWordInstrPoorPerformanceText,
    show_clickable_nav: true,
  };
  /* Instructions shown to participants before test trials begin. */
  var ColorWordTestInstr = {
    type: 'instructions',
    pages: ColorWordTestInstrText,
    show_clickable_nav: true,
  };

  /* define thank you trial */
  const conclusion = createConclusionMessageBlock();

  var Stimulus = {
    type: 'html-keyboard-response',
    stimulus: function () {
      var Stim =
        '<p class="stimulus" style="color:rgb' +
        jsPsych.timelineVariable('Color', true) +
        ';">' +
        jsPsych.timelineVariable('Word', true) +
        '</p>';
      var temp = PutIntoTable('', Stim);
      return temp;
      //return '<p class="stimulus" style="color:rgb'+jsPsych.timelineVariable('Color', true)+';">' +jsPsych.timelineVariable('Word', true)+'</p>';
    },
    choices: ResponseChoices,
    post_trial_gap: 0,
    on_finish: function (data) {
      data.correct =
        data.key_press ==
        jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.letter);
      /* If the ESCAPE key is pressed the current timeline is ended and the thank you screen is shown */
      if (data.key_press == 27) {
        //jsPsych.endCurrentTimeline();
        jsPsych.end();
      }
    },
  };

  var prac_stimulus = Object.assign({}, Stimulus);
  prac_stimulus = Object.assign(prac_stimulus, {
    data: {
      Congruency: jsPsych.timelineVariable('Congruency'),
      letter: jsPsych.timelineVariable('letter'),
      type: 'practice trial',
    },
  });

  var test_stimulus = Object.assign({}, Stimulus);
  test_stimulus = Object.assign(test_stimulus, {
    data: {
      Congruency: jsPsych.timelineVariable('Congruency'),
      letter: jsPsych.timelineVariable('letter'),
      type: 'test trial',
    },
  });

  var fixation = {
    type: 'html-keyboard-response',
    stimulus: function () {
      var temp = PutIntoTable('', '+');
      return temp;
    },

    //return '<div style="font-size:60px;">+</div><p><p><img src="StroopColorsKeyboard.png" style="position:relative; bottom:-200px">'},
    choices: jsPsych.NO_KEYS,
    trial_duration: function () {
      return jsPsych.randomization.sampleWithoutReplacement(
        [250, 500, 750, 1000, 1250, 1500, 1750, 2000],
        1
      )[0];
    },
    data: { type: 'fixation' },
  };

  /* ARROWS 37 = left, 38 = up, 39 = right, 40 = down */
  /* Escape = 27 */
  var feedback = {
    type: 'html-keyboard-response',
    trial_duration: FeedbackLength,
    stimulus: function () {
      var last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
      if (last_trial_correct) {
        const temp = PutIntoTable('', 'Correct!');
        return temp;
      } else {
        const temp = PutIntoTable('', 'Incorrect');
        return temp;
      }
    },
  };

  // Define a practice procedure which provides feedback
  var practice_procedure = {
    timeline: [fixation, prac_stimulus, feedback],
    timeline_variables: StroopColorWordList,
    sample: {
      type: 'fixed-repetitions',
      size: ColorWordPracticeRepeats,
    },
  };

  // Define the test procedure which does NOT provide feedback
  var test_procedure = {
    timeline: [fixation, test_stimulus],
    timeline_variables: StroopColorWordList,
    sample: {
      type: 'fixed-repetitions',
      size: ColorWordTestRepeats,
    },
  };
  // Prepare debriefing for after the practice trials
  var debrief = {
    type: 'html-keyboard-response',
    stimulus: function () {
      var DataFromThisPracticeRun = jsPsych.data
        .get()
        .filter({ type: 'practice trial' })
        .last(16 * ColorWordPracticeRepeats);
      var total_trials = DataFromThisPracticeRun.count();
      var NumberCorrect = DataFromThisPracticeRun.filter({
        correct: true,
      }).count();
      var accuracy = Math.round((NumberCorrect / total_trials) * 100);

      /*var congruent_rt = Math.round(jsPsych.data.get().filter({correct: true, Congruency: 'Con'}).select('rt').mean());
     var incongruent_rt = Math.round(jsPsych.data.get().filter({correct: true, Congruency: 'Incon'}).select('rt').mean());*/

      return (
        '<p>You responded correctly on <strong>' +
        accuracy +
        '%</strong> of the ' +
        total_trials +
        ' trials.</p> ' +
        /*"<p>Your average response time for congruent trials was <strong>" + congruent_rt + "ms</strong>.</p>"+
     "<p>Your average response time for incongruent trials was <strong>" + incongruent_rt + "ms</strong>.</p>"+*/
        '<p>Press any key to continue the experiment.</p>'
      );
    },
  };
  // This a conditional block which checks to see if the performance during practice was good enough
  // if performance on the practice is above 50% accurate then the test procedure is done.
  // otherwise practice is done again
  var if_node = {
    timeline: [ColorWordPoorPerfInstr, practice_procedure],
    conditional_function: function () {
      // check performance on the practice
      var DataFromThisPracticeRun = jsPsych.data
        .get()
        .filter({ type: 'practice trial' })
        .last(16 * ColorWordPracticeRepeats);
      var total_trials = DataFromThisPracticeRun.count();
      var NumberCorrect = DataFromThisPracticeRun.filter({
        correct: true,
      }).count();
      var accuracy = Math.round((NumberCorrect / total_trials) * 100);
      if (accuracy < 50) {
        return true;
      } else {
        return false;
      }
    },
  };

  timeline.push(ColorWordInstr);
  // run the practice trials
  timeline.push(practice_procedure);
  // provide feedback as to their performance
  timeline.push(debrief);
  // decide if the person did well enough
  timeline.push(if_node);
  // decide if the person did well enough
  timeline.push(if_node);
  // Present test instructions
  timeline.push(ColorWordTestInstr);
  // run the test
  timeline.push(test_procedure);
  timeline.push(conclusion);

  /* start the experiment */
  //jatos.onLoad(function() {
  jsPsych.init({
    experiment_width: 600,
    timeline: timeline,
    on_interaction_data_update: function (data) {
      console.log(JSON.stringify(data));
    },
    on_finish: async function (data) {
      await storeTaskResults({
        task: 'stroop',
        participantId,
        data,
      });
      resolve();
    },
  });
});

async function runExperiment() {
  // console.log(experiment);
  await experiment;
}

export default runExperiment;
