import { execSync } from 'child_process';
import { resolve } from 'path';
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
    const { setup, inspect, teardown } = inspector;

    try {
      if (setup) {
        await execSync(setup)
      }

      const data = await execSync(inspect);

      console.log(data.toString())
      if (teardown) {
        await execSync(teardown)
      }

      done(null, JSON.parse(data.toString()));
    } catch (e) {
      done(e);
    }
  }

  launch() {
    const queue = new Bull('inspect',  'redis://localhost:6379');

    queue.clean(10).then(() => {
      queue.process('inspect', 1, this.runInspection)

      const [name, options] = Object.entries(config)[0]
      // .forEach(([name, options]) => {
        console.log(name, options)
        queue.add('inspect', Object.assign({
          name,
          inspectorName: name
        }, options));
      // })
    })
  }
}
