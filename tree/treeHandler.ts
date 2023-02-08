import * as fs from 'fs/promises';
import * as path from 'path';
import { Tree } from '../types';

export default class TreeHandler {
  schema: Object;
  constructor(schema: Object) {
    this.schema = schema;
  }

  /**
   * Save tree to json file with unix timestamp.
   *
   * @param name of saved json file
   * @param tree object which will be serialized to json file
   */
  async save(name: string, tree: Object) {
    const timestamp = Date.now().toString();
    await fs.writeFile(
      path.resolve(__dirname, timestamp.concat('_', name, '.json')),
      JSON.stringify(tree)
    );
  }

  /**
   * Get latest json file.
   *
   * @returns latest json file
   * @throws if not file exists
   */
  async getLast() {
    const ls = await fs.readdir(__dirname);
    const jsons = ls.filter((file) => file.includes('.json'));
    if (jsons.length === 0) throw new Error('No file exists.');
    jsons.sort((a, b) => Number(a.split('_')[0]) - Number(b.split('_')[0]));
    return jsons.sort().slice(-1)[0];
  }

  /**
   * Get Tree object from given json file name.
   *
   * @param name of json file from which Tree object will be created
   *
   * @returns Tree object
   */
  async load(name: string) {
    const data = await fs.readFile(path.resolve(__dirname, name));
    return JSON.parse(data.toString());
  }

  /**
   * Add metadata (data name and CID) to the given tree branch.
   *
   * @param branch branch like path to the choosen node, e.g. `sarcoma/soft-tissue-sarcoma/liposarcoma/dicom`
   * @param fileName file name which will be placed at given branch
   * @param cid of the file which will be placed at given branch
   * @param tree object which will be updated by given data
   *
   * @throws
   * - if name in given branch and name in tree object is not found
   * - if index of looking object is not found
   */
  async add(branch: string, fileName: string, cid: string, tree: Tree) {
    if (branch.slice(-1) === '/') {
      branch = branch.slice(0, -1);
    }
    const branchLst = branch.split('/');

    if (branchLst[0] === tree.name && branchLst.length === 1) {
      tree.children.push({
        name: fileName,
        CID: cid,
      });
      return;
    }

    if (branchLst[0] !== tree.name)
      throw new Error('current tree node name and branch node name mismatch');

    const idx = tree.children.findIndex(
      (obj) => obj.name === branchLst.slice(1, 2)[0]
    );

    if (idx === -1)
      throw new Error(`tree doesn't contain file ${branchLst.slice(1, 2)[0]}`);

    await this.add(
      branchLst.slice(1).join('/'),
      fileName,
      cid,
      tree.children[idx]
    );
  }
}
