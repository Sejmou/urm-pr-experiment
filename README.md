# URM PR Experiment
This is the code repository for the experiments that are part of our [User Research Methods](https://tiss.tuwien.ac.at/course/courseDetails.xhtml?dswid=9954&dsrid=202&courseNr=193056&semester=2022W&locale=en) project at TU Wien.

## Installation
Make sure [yarn](https://classic.yarnpkg.com/lang/en/docs/install) is installed and run
```
yarn
```

Alternatively, you can also use NPM (Node Package Manager) that comes bundled with Node.js (https://nodejs.org/en/download/) and run
```
npm install
```

## Running the code
Run
```
yarn dev
```

or 
```
npm run dev
```

## Downloading experiment results collected on Google Cloud Storage via Firebase (probably only works for me (Sejmou) as Firebase Project "owner")

1. Download and install `gsutil` - instructions [here](https://cloud.google.com/storage/docs/gsutil_install)
2. After installation, run `gcloud auth login` to log in (otherwise will get 401 Unauthorized error with following command)
3. Run `gsutil -m cp -R gs://urm-pr-experiment.appspot.com/experiment_results/* ./data_analysis/data` to download the relevant CSV files from Firebase storage to `data_analysis/data`