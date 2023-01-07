import { initializeApp } from 'firebase/app';
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';
import { getDatabase, ref as dbRef, push, set, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyDSuo_-NILX3DolY_q7iicBnZkhlBrhmBg',
  authDomain: 'urm-pr-experiment.firebaseapp.com',
  databaseURL:
    'https://urm-pr-experiment-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'urm-pr-experiment',
  storageBucket: 'urm-pr-experiment.appspot.com',
  messagingSenderId: '557125757447',
  appId: '1:557125757447:web:d82685b6cc1030cef518a2',
  measurementId: 'G-HZVMQ67M9R',
};

export const firebaseActive = false; // hacky way to disable firebase for local development

const app = firebaseActive ? initializeApp(firebaseConfig) : null;
const storage = app ? getStorage(app) : null;
const db = app ? getDatabase(app) : null;

export async function uploadExperimentTaskResults(
  filename: string,
  csvString: string
) {
  if (!storage) return;
  const file = new File([csvString], filename, { type: 'text/csv' });
  await uploadBytes(
    storageRef(storage, `experiment_results/${filename}`),
    file
  );
  console.log('Uploaded results to Firebase cloud storage as', filename);
  return;
}

const experimentGroups = {
  music: 'music',
  silence: 'silence',
} as const;

const experimentStates = {
  started: 'started',
  completed: 'completed',
} as const;

type ExperimentState = keyof typeof experimentStates;
type ExperimentGroup = keyof typeof experimentGroups;
export type ParticipantData = {
  participantId: string;
  timestamp: number;
};

export async function getParticipants(
  state: ExperimentState,
  group: ExperimentGroup
) {
  if (!db) {
    // return some dummy data
    if (state === experimentStates.completed) return [];
    if (group === experimentGroups.silence) return [];
    const data: ParticipantData[] = [
      {
        participantId: 'dummy',
        timestamp: Date.now(),
      },
    ];
    return data;
  }
  const ref = dbRef(db, `${state}/${group}`);
  const res = await get(ref);
  const val = res.val();
  if (!val) return [];
  const participants = Object.values(val) as ParticipantData[]; // Firebase stores data as an object with unique "Firebase IDs" as keys -> not needed!
  return participants;
}

async function storeExperimentStateUpdate(
  participantId: string,
  state: ExperimentState,
  group: ExperimentGroup
) {
  try {
    if (!db) return;
    const groupRef = dbRef(db, `${state}/${group}`);
    console.log('Storing experiment state update', state, group, participantId);
    const stateInfoRef = push(groupRef);
    const participantData: ParticipantData = {
      participantId,
      timestamp: Date.now(),
    };
    await set(stateInfoRef, participantData);
  } catch (error) {
    console.log(error);
  }
}

export async function storeExperimentStart(
  participantId: string,
  group: ExperimentGroup
) {
  await storeExperimentStateUpdate(
    participantId,
    experimentStates.started,
    group
  );
}

export async function storeExperimentCompletion(
  participantId: string,
  group: ExperimentGroup
) {
  await storeExperimentStateUpdate(
    participantId,
    experimentStates.completed,
    group
  );
}

export async function storeMailingListParticipant(
  participantId: string,
  email: string
) {
  if (!db) return;
  const ref = dbRef(db, `mailing_list`);
  console.log('Storing mailing list participant', participantId, email);
  const stateInfoRef = push(ref);
  const participantIdAndEmail = {
    participantId,
    email,
  };
  await set(stateInfoRef, participantIdAndEmail);
}
