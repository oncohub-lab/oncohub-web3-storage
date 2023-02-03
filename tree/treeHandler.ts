import * as fs from 'fs/promises';
import * as path from 'path';
import schema from '../schema.json';

class treeHandler {
  schema: Object;
  constructor(schema: Object) {
    this.schema = schema;
  }

  async create(name: string, tree: Object) {
    const timestamp = Date.now().toString();
    await fs.writeFile(
      path.resolve(__dirname, timestamp.concat('_', name, '.json')),
      JSON.stringify(tree)
    );
  }

  async getLast() {
    const ls = await fs.readdir(__dirname);
    const jsons = ls.filter((file) => file.includes('.json'));
    jsons.sort((a, b) => Number(a.split('_')[0]) - Number(b.split('_')[0]));
    return jsons.sort().slice(-1)[0];
  }

  async load(name: string) {
    const data = await fs.readFile(path.resolve(__dirname, name));
    return JSON.parse(data.toString());
  }
}

const tree = new treeHandler(schema);
// tree.create('tree', tree.schema);
(async function () {
  const name = await tree.getLast();
  console.log(name);
  const file = await tree.load(name);
  console.log(file);
})();
