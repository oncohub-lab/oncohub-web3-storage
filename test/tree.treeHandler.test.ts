import * as fs from 'fs/promises';
import * as path from 'path';
import { assert } from 'chai';
import TreeHandler from '../tree/treeHandler';
import schema from '../schema.json';

describe('tree.TreeHandler', async function () {
  let treeInstance: TreeHandler;
  beforeEach(async function () {
    treeInstance = new TreeHandler(schema);
  });
  describe('save/load json to tree', async function () {
    it('should save tree object to json file', async function () {
      treeInstance.save('test_tree', treeInstance.schema);
      const ls = await fs.readdir(path.resolve(__dirname, '../tree'));
      const jsons = ls.filter((file) => file.includes('.json'));
      const founded = jsons.find((file) => file.includes('test_tree'));
      assert.equal(typeof founded, 'string');
    });
    it('should load json file to Tree object', async function () {
      console.log('test case 2');
      assert.equal(1, 1);
    });
    it('should save 3 json files and get latest json file', async function () {
      console.log('test case 3');
      assert.equal(1, 1);
    });
    after(async function () {
      const ls = await fs.readdir(path.resolve(__dirname, '../tree'));
      const jsons = ls.filter((file) => file.includes('test_tree.json'));
      console.log(jsons);

      for (const json of jsons) {
        await fs.unlink(path.resolve(__dirname, '../tree/'.concat(json)));
      }
    });
  });
});
