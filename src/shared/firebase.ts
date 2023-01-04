import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDSuo_-NILX3DolY_q7iicBnZkhlBrhmBg',
  authDomain: 'urm-pr-experiment.firebaseapp.com',
  projectId: 'urm-pr-experiment',
  storageBucket: 'urm-pr-experiment.appspot.com',
  messagingSenderId: '557125757447',
  appId: '1:557125757447:web:d82685b6cc1030cef518a2',
  measurementId: 'G-HZVMQ67M9R',
};

initializeApp(firebaseConfig);
const storage = getStorage();

export async function uploadExperimentResults(
  filename: string,
  csvString: string
) {
  const file = new File([csvString], filename, { type: 'text/csv' });
  await uploadBytes(ref(storage, `experiment_results/${filename}`), file);
  return;
}
