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
}

const tree = new treeHandler(schema);
tree.create('tree', tree.schema);
