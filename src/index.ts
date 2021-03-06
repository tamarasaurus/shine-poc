import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { execSync } from 'child_process';
import Storage from './storage/inspection'
import * as request from 'request-promise';

const storage = new Storage();
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
  const commit = req.body.properties['sonar.analysis.commit'];
  const user = req.body.properties['sonar.analysis.user'];

  request( {
      method: 'POST',
      uri: 'https://sonarcloud.io/api/issues/search?componentKeys=tamarasaurus_pim-community-dev&languages=js&types=CODE_SMELL,BUG&ps=500',
      headers: {
       'content-type': 'application/x-www-form-urlencoded'
      }
  }).then((inspection) => {
    storage.insert({commit, user, name: 'sonar', inspection}).then(() => {
      res.sendStatus(200)
    }).catch((e) => {
      console.log(e);
      res.sendStatus(500)
    })
  }).catch((e) => {
    console.log(e)
    res.sendStatus(500)
  });
})

app.post('/job', cors(), (req, res) => {
  const { commit, name, inspection, user }: any = req.body;

  storage.insert({commit, user, name, inspection}).then(() => {
    res.sendStatus(200)
  }).catch((e) => {
    console.log(e);
    res.sendStatus(500)
  })
})

app.get('/analysis', cors(), (req, res) => {
  storage.findAll().then((result) => {
    res.json(result.rows)
  }).catch((e) => {
    console.log(e);
    res.sendStatus(404)
  });
})

app.get('/analysis/:commit', cors(), (req, res) => {
  const { commit } = req.params;
  storage.findByCommit(commit).then((result) => {
    res.json(result.rows)
  }).catch((e) => {
    console.log(e);
    res.sendStatus(404)
  });
})

app.get('/index/:commit', cors(), (req, res) => {
  res.json({ index: 1.234341 })
})

app.post('/hook', cors(), (req, res): void => {
  const pullRequest = req.body.pull_request;
  const commit = req.body.after

  console.log('Run analysis for', commit, pullRequest.user.login)
  // if (pullRequestIsMergedOnMaster(pullRequest)) {
  const data = execSync('./src/trigger_inspection.sh', {
    env: {
      COMMIT: commit,
      USER: pullRequest.user.login,
      TRAVIS_TOKEN: process.env.TRAVIS_TOKEN
    }
  })

  console.log(data.toString());
  // }

  res.sendStatus(200);
});

app.listen(process.env.PORT || '8080', () => console.log(`Example app listening on port 8080`))
