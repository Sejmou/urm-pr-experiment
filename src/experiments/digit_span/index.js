import '@lib/jspsych-6.0.4/jspsych.js';
import '@lib/jspsych-6.0.4/jspsych.js';
import '@lib/jspsych-6.0.4/plugins/jspsych-html-keyboard-response.js';
import '@lib/jspsych-6.0.4/plugins/jspsych-digit-span-recall.js';
import '@lib/jspsych-6.0.4/plugins/jspsych-survey-text.js';
import '@lib/jspsych-6.0.4/plugins/jspsych-instructions.js';
import '@lib/jspsych-6.0.4/plugins/jspsych-fullscreen.js';
import '@lib/jspsych-6.0.4/css/jspsych_digitspan.css';
import { getParticipantId } from '../../shared/experiments';
import { createConclusionMessageBlock, storeExperimentResults } from '../utils';

// This code has been adapted from https://github.com/mahiluthra/working_memory_tests/blob/c4700e7765833364d2c913667b99063afbaa2437/digit_span_task.html

/*
    This is a web-based digit span working memory test.
    It is modelled after the forward digit span test described in Woods et al (2011) [https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2978794/].
    However, users can easily customize this test for their own purposes.
    Easily customizable variables have been listed below. For further changes to the test, knowledge of JavaScipt may be required.

    For smooth functioning of the test, make sure all the associated github files within the repository have been downloaded (especially the folder named 'jspsych-6.0.4').
    Results from this test will be automatically downloaded into the downloads folder of your desktop.

    For further details, please refer to the README.
*/

const experiment = new Promise(resolve => {
  //----- CUSTOMIZABLE VARIABLES -----------------------------------------

  var nTrials = 2; // number of trials in the test
  var minSetSize = 3; // starting digit length
  var stimuli_duration = 1000; // number of miliseconds to display each digit
  var recall_duration = null; // number of miliseconds to allow recall. If null, there is no time limit.
  const debug = true; // set to true to skip demo procedure and show only two trials in test procedure

  //----------------------------------------------------------------------

  var possibleNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']; //possible digits participants can get

  var selection = jsPsych.randomization.sampleWithoutReplacement(
    possibleNumbers,
    minSetSize
  ); //chooses random digits
  var selection_id = -1;

  // keeps track of participant's scores:
  var nError = 0;
  var highest_span_score = 0;
  var consec_error_score = 0;

  const participantId = getParticipantId();

  // instruction page
  var instructions = {
    type: 'instructions',
    pages: function () {
      var pageOne =
        "<div style='font-size:20px;'><b>INSTRUCTIONS</b><br><br>This is the digit span task.<br><br>In this task, you will have to remember a sequence of numbers presented on the screen one after the other.<br>At the end of each trial, enter all the numbers into the onscreen number-pad in their correct order.<br><br><u>Example:</u> if the sequence is '7 4 5 1', enter '7 4 5 1' in this exact order.<br><br>You will now be given practice trials to help you understand the task.<br>Press 'Next' to start the practice trials.<br><br></div>";
      return [pageOne];
    },
    allow_backward: false,
    button_label_next: 'Next',
    show_clickable_nav: true,
  };

  var after_demo_instructions = {
    type: 'instructions',
    pages: function () {
      var pageOne =
        "<div style='font-size:20px;'>You have completed the practice trials. <br><br> If you are clear about the task, click 'Next' to proceed to the main trials.</div>";
      return [pageOne];
    },
    allow_backward: false,
    button_label_next: 'Next',
    show_clickable_nav: true,
    on_finish: function () {
      minSetSize = 3;
      selection = jsPsych.randomization.sampleWithoutReplacement(
        possibleNumbers,
        minSetSize
      );
    },
  };

  var test_stimuli = {
    type: 'html-keyboard-response',
    stimulus: function () {
      selection_id += 1;
      return (
        '<div style="font-size:70px;">' + selection[selection_id] + '</div>'
      );
    },
    choices: jsPsych.NO_KEYS,
    trial_duration: stimuli_duration,
    on_finish: function () {
      if (selection_id + 1 >= selection.length) {
        jsPsych.endCurrentTimeline();
      }
    },
  };

  var recall = {
    type: 'digit-span-recall',
    correct_order: function () {
      return selection;
    },
    trial_duration: recall_duration,
    on_finish: function () {
      var acc = jsPsych.data.get().last(1).values()[0].accuracy;
      if (acc == 1) {
        if (highest_span_score < minSetSize) {
          highest_span_score = minSetSize;
        }
        minSetSize += 1;
        nError = 0;
      } else if (nError < 1) {
        // checks for number of consecutive errors
        nError += 1;
      } else {
        if (consec_error_score < minSetSize) {
          consec_error_score = minSetSize;
        }
        minSetSize = Math.max(3, minSetSize - 1);
      }
      if (minSetSize <= 8) {
        // bottom code prevents immediate repition of digits
        selection = jsPsych.randomization.sampleWithoutReplacement(
          possibleNumbers,
          minSetSize
        );
      } else {
        selection = jsPsych.randomization.sampleWithoutReplacement(
          possibleNumbers,
          8
        );
        var extra = minSetSize - 8;
        var id = possibleNumbers.indexOf(selection[7]);
        possibleNumbers.splice(id, 1);
        var extraNumbers = jsPsych.randomization.sampleWithoutReplacement(
          possibleNumbers,
          extra
        );
        selection = selection.concat(extraNumbers);
        possibleNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
      }
      selection_id = -1;
    },
  };

  var feedback = {
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

  var test_stack = {
    timeline: [test_stimuli],
    repetitions: 17,
  };

  var test_procedure = {
    timeline: [test_stack, recall, feedback],
    repetitions: !debug ? nTrials : 2,
  };

  var demo_procedure = {
    timeline: [test_stack, recall, feedback],
    repetitions: 3,
  };

  var timeline = [];
  timeline.push({
    type: 'fullscreen',
    fullscreen_mode: true,
  });
  timeline = timeline.concat(
    !debug
      ? [instructions, demo_procedure, after_demo_instructions, test_procedure]
      : [instructions, test_procedure]
  );
  timeline.push({
    type: 'fullscreen',
    fullscreen_mode: false,
  });
  timeline.push(conclusion);

  jsPsych.init({
    timeline: timeline,
    on_finish: async function (data) {
      const relevantData = data.filter({ trial_type: 'digit-span-recall' });
      await storeExperimentResults({
        task: 'digit_span',
        participantId,
        data: relevantData,
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
