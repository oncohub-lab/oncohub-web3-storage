import * as fs from 'fs/promises';
import * as path from 'path';
import schema from '../schema.json';

class treeHandler {
  schema: Object;
  constructor(schema: Object) {
    this.schema = schema;
  }

  async save(name: string, tree: Object) {
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

  async add(branch: string, fileName: string, cid: string, tree: Tree) {
    if (branch.slice(-1) === '/') {
      branch = branch.slice(0, -1);
    }
    const branchLst = branch.split('/');

    if (branchLst[0] == tree.name && branchLst.length === 1) {
      tree.children.push({
        name: fileName,
        CID: cid,
      });
      return;
    }

    if (branchLst[0] === tree.name)
      throw new Error(`current tree node name and branch node name mismatch`);
    if (branchLst.length <= 2)
      throw new Error(
        `to go deeper into tree, at least 2 items is needed (current and next)`
      );

    const idx = tree.children.findIndex(
      (obj) => obj.name === branchLst.slice(1, 2)[0]
    );

    if (idx === -1)
      throw new Error(`no such file ${branchLst.slice(1, 2)[0]} inside tree`);

    await this.add(
      branchLst.slice(1).join('/'),
      fileName,
      cid,
      tree.children[idx]
    );
  }
}
