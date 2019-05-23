import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { execSync } from 'child_process';

const tmpData: any = {}
const app = express()

function pullRequestIsMergedOnMaster(pullRequest) {
  if (!pullRequest) return false;
  const { state, base, merged } = pullRequest
  return state === 'closed' && base.ref === 'master' && merged === true
}

app.options('*', cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({limit: '50mb'}))
app.use(function(req, res, next) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next()
})

app.post('/job/sonar', cors(), (req, res) => {
  const inspection = req.body;
  const { commit }: any = req.body.properties;

  if (!tmpData[commit]) {
    tmpData[commit] = {}
  }

  tmpData[commit]['sonarcube'] = inspection
  res.sendStatus(200);
})

app.post('/job', cors(), (req, res) => {
  const { commit, name, inspection }: any = req.body;
  if (!tmpData[commit]) {
    tmpData[commit] = {}
  }
  tmpData[commit][name] = inspection
  res.sendStatus(200);
})

app.get('/analysis', cors(), (req, res) => {
  res.json(tmpData);
})

app.get('/analysis/:commit', cors(), (req, res) => {
  const { commit } = req.params;
  res.json(tmpData[commit] || {});
})

app.get('/index/:commit', cors(), (req, res) => {
  res.json({ index: 1.234341 })
})

app.post('/hook', cors(), (req, res): void => {
  const pullRequest = req.body.pull_request;
  const commit = req.body.after

  console.log('Run analysis for', commit)
  // if (pullRequestIsMergedOnMaster(pullRequest)) {
  const data = execSync('./src/trigger_inspection.sh', {
    env: {
      COMMIT: commit,
      USER: pullRequest.merged_by_login,
      TRAVIS_TOKEN: process.env.TRAVIS_TOKEN
    }})

  console.log(data.toString());
  // }

  res.sendStatus(200);
});

app.listen(process.env.PORT || '8080', () => console.log(`Example app listening on port 8080`))
