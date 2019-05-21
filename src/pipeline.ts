import { execSync } from 'child_process';
import * as Bull from 'bull'
import * as config from './inspectors/config.json'

interface InspectorConfig {
  [name: string]: {
    setup?: string;
    inspect: string;
    teardown?: string;
  }
}

interface EventData {
  user: string;
  commit: string;
}

export default class Pipeline {
  private eventData: EventData;

  constructor(eventData: EventData) {
    this.eventData = eventData;
  }

  async runInspection(job: Bull.Job, done: Bull.DoneCallback) {
    const inspectorConfig: InspectorConfig = config;
    const inspector = inspectorConfig[job.data.name]
    const { inspect } = inspector;
    const COMMIT = this.eventData.commit;

    console.log('Start', job.data.name);

    try {
      const data = await execSync(inspect, { env: { COMMIT }});
      done(null, JSON.parse(data.toString()));
    } catch (e) {
      console.log(e)
      done(e);
    }
  }

  async launch() {
    const queue = new Bull('inspect',  'redis://localhost:6379', {
      settings: {
        stalledInterval: 0,
        lockDuration: 999999999
      }
    });

    await Promise.all([queue.clean(10), queue.clean(10, 'failed')])

    queue.process('inspect', 1, this.runInspection.bind(this))

    const COMMIT = this.eventData.commit;
    await execSync('./src/setup.sh', { stdio: 'inherit', env: { COMMIT }})

    Object.entries(config).forEach(([name, options]) => {
      queue.add('inspect', Object.assign({ name, inspectorName: name }, options));
    })
  }
}
