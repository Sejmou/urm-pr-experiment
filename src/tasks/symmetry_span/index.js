import '@lib/jspsych-6.0.4/jspsych.js';
import '@lib/jspsych-6.0.4/plugins/jspsych-html-keyboard-response.js';
import '@lib/jspsych-6.0.4/plugins/jspsych-symmetry-judgement-task.js';
import '@lib/jspsych-6.0.4/plugins/jspsych-survey-text.js';
import '@lib/jspsych-6.0.4/plugins/jspsych-instructions.js';
import '@lib/jspsych-6.0.4/plugins/jspsych-fullscreen.js';
import '@lib/jspsych-6.0.4/plugins/jspsych-spatial-span.js';
import '@lib/jspsych-6.0.4/plugins/jspsych-spatial-span-recall.js';
import '@lib/jspsych-6.0.4/css/jspsych_grid.css';

// This code has been adapted from https://github.com/mahiluthra/working_memory_tests/blob/c4700e7765833364d2c913667b99063afbaa2437/symmetry_span_task.html

/*
      This is a web-based symmetry span working memory test.
      It is modelled after the operation span test described in Oswald et al (2014) [https://link.springer.com/article/10.3758/s13428-014-0543-2].
      However, users can easily customize this test for their own purposes.
      Easily customizable variables have been listed below. For further changes to the test, knowledge of JavaScipt may be required.

      For smooth functioning of the test, make sure all the associated github files within the repository have been downloaded (especially the folder named 'jspsych-6.0.4').
      Results from this test will be automatically downloaded into the downloads folder of your desktop.

      For further details, please refer to the README.
  */

import symm_instructions from './symm_instructions.png';
import symmetrySpanExampleGrid from './symmetrySpanExampleGrid.png';
import { getParticipantId } from '../../shared/experiment';
import { storeTaskResults, createConclusionMessageBlock } from '../utils';

const experiment = new Promise(resolve => {
  //----- CUSTOMIZABLE VARIABLES -----------------------------------------
  let minSetSize = 3; // starting length of each trial (i.e., min number of letters in a trial)
  let maxSetSize = 5; // ending length of each trial (i.e., max number of letters in a trial)
  let repSet = 1; // number of times each set size should be repeated
  let randomize = true; // present different set sizes in random order. if false, set sizes will be presented in ascending order

  //----------------------------------------------------------------------

  var setSizes = []; // different set sizes
  for (var i = minSetSize; i <= maxSetSize; i++) {
    for (var r = 1; r <= repSet; r++) {
      setSizes.push(i);
    }
  }

  var grid = 4;
  var matrix = [];
  for (let i = 0; i < grid; i++) {
    const m1 = i;
    for (var h = 0; h < grid; h++) {
      const m2 = h;
      matrix.push([m1, m2]);
    }
  }

  var nTrials = setSizes.length;
  if (randomize) {
    setSizes = jsPsych.randomization.sampleWithoutReplacement(
      setSizes,
      nTrials
    );
  } // shuffle through the set sizes

  var squaregridDemoArray = [3, 4, 4];
  var fullDemoArray = [3, 3, 4];
  var nPracticeTrials = squaregridDemoArray.length; //number of practice trials for square memorization
  var nfullDemo = fullDemoArray.length;

  setSizes = squaregridDemoArray.concat(fullDemoArray, setSizes);
  var totalTrials = setSizes.length; //total number of trials in the entire task
  var n = 0; //keeps track of number of trials gone by

  var selection = jsPsych.randomization.sampleWithoutReplacement(
    matrix,
    setSizes[n]
  );
  var selection_id = -1; //keeps track of recall items within a test stack

  var nSymmetryAcc = 0; //feedback
  var nSquaresRecalled = 0; //feedback

  var instructions4 = {
    type: 'instructions',
    pages: function () {
      const pageOne =
        '<div style="font-size:20px;">Your task is to remember the sequence of red grid cells.<br><br>In between, you will also be asked to judge whether images are symmetric or not.</div>';
      return [pageOne];
    },
    allow_backward: false,
    button_label_next: 'Next',
    show_clickable_nav: true,
  };

  var nProportionDemo = 0;
  var cog_load_demo = {
    type: 'symmetry-judgement-task',
    size: 8,
    trial_duration: null,
    number_darkened: [17, 18, 19],
    stimulus: 'Is this image symmetric?',
    proportion: function () {
      nProportionDemo += 1;
      if (nProportionDemo == 1) {
        return 1;
      } else if (nProportionDemo == 2) {
        return 0;
      } else {
        return 0.5;
      }
    },
  };

  var cog_load = {
    type: 'symmetry-judgement-task',
    size: 8,
    trial_duration: 6000,
    number_darkened: [17, 18, 19],
    stimulus: 'Is this image symmetric?',
    on_finish: function () {
      var acc = jsPsych.data.get().last(1).values()[0].accuracy;
      if (acc == 1) {
        nSymmetryAcc += 1;
      }
    },
  };

  var test_stimuli = {
    type: 'spatial-span',
    grid_size: function () {
      return grid;
    },
    trial_duration: 1000,
    selected_box: function () {
      selection_id += 1;
      return selection[selection_id];
    },
  };

  var end_test_stimuli = {
    type: 'spatial-span',
    grid_size: function () {
      return grid;
    },
    trial_duration: 0,
    selected_box: function () {
      return selection[selection_id];
    },
    display_red_box: false,
    on_finish: function () {
      if (selection_id + 1 >= selection.length) {
        jsPsych.endCurrentTimeline();
      }
    },
  };

  var recall = {
    type: 'spatial-span-recall',
    grid_size: function () {
      return grid;
    },
    correct_order: function () {
      return selection;
    },
    data: function () {
      return { set_size: setSizes[n] };
    },
    on_finish: function () {
      globalThis.nSquares = setSizes[n];
      nSquaresRecalled = jsPsych.data.get().last(1).values()[0].accuracy;
      n += 1;
      selection = jsPsych.randomization.sampleWithoutReplacement(
        matrix,
        setSizes[n]
      );
      selection_id = -1;
    },
  };

  var feedback = {
    type: 'instructions',
    pages: function () {
      let pageOne =
        "<div style='font-size:20px;'><b>You recalled <font color='blue'>" +
        nSquaresRecalled +
        ' out of ' +
        globalThis.nSquares +
        '</font> squares in their correct order.</b><br><br>';

      pageOne +=
        "You made <font color='blue'>" +
        nSymmetryAcc +
        ' out of ' +
        globalThis.nSquares +
        '</font> accurate symmetry judgement(s).<br><br></div>';

      return [pageOne];
    },
    allow_backward: false,
    button_label_next: 'Next Trial',
    show_clickable_nav: true,
    on_finish: function () {
      nSymmetryAcc = 0;
    },
  };

  var feedbackSymm = {
    type: 'html-keyboard-response',
    stimulus: function () {
      var text = '';
      var accuracy = jsPsych.data.get().last(1).values()[0].accuracy;
      if (accuracy == 1) {
        text +=
          '<div style="font-size:35px; color:rgb(0 220 0)"><b>Correct</div>';
      } else {
        text +=
          '<div style="font-size:35px; color:rgb(240 0 0)"><b>Incorrect</div>';
      }
      //text += '<div style="font-size:30px; color:rgb(0 0 0)"><br><br>New trial starting now.</div>'
      return text;
    },
    choices: jsPsych.NO_KEYS,
    trial_duration: 1000,
  };

  const conclusion = createConclusionMessageBlock();

  const participantId = getParticipantId();

  var test_stack = {
    timeline: [test_stimuli, cog_load, end_test_stimuli],
    repetitions: 10,
  };

  var test_procedure = {
    timeline: [test_stack, recall, feedback],
    repetitions: nTrials,
  };

  let timeline = [];
  timeline.push({
    type: 'fullscreen',
    fullscreen_mode: true,
  });
  timeline = timeline.concat([instructions4, test_procedure]);
  timeline.push({
    type: 'fullscreen',
    fullscreen_mode: false,
  });
  timeline.push(conclusion);

  jsPsych.init({
    timeline: timeline,
    on_finish: async function (data) {
      const relevantData = data.filter([
        { trial_type: 'spatial-span-recall' },
        { trial_type: 'symmetry-judgement-task' },
      ]);
      await storeTaskResults({
        task: 'symmetry_span',
        participantId,
        data: relevantData,
      });
      resolve();
      resolve();
    },
  });
});

async function runExperiment() {
  // console.log(experiment);
  await experiment;
}

export default runExperiment;
