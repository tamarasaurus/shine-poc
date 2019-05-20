import { execSync } from 'child_process';
import { resolve } from 'path';

export default class Pipeline {
  private eventData;

  constructor(eventData: { user: string, commit: string }) {
    this.eventData = eventData;
    console.log('Launch pipeline', eventData);
  }

  launch() {
    const inspectors = {
      phpstan: 'phpstan.sh',
      phpmetrics: 'phpmetrics.sh'
    }

    const analysis = [];

    execSync(resolve(process.cwd(), './src/setup.sh'));

    for (let inspector in inspectors) {
      const script = inspectors[inspector];
      const data = execSync(resolve(process.cwd(), `./src/inspectors/${script}`))
      analysis[inspector] = JSON.parse(data.toString());
    }

    console.log(analysis);
    // execSync(resolve(process.cwd(), './src/teardown.sh'));
  }

  parseInspectorOutput() {

  }
}
