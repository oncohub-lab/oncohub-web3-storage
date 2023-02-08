import * as fs from 'fs/promises';
import * as path from 'path';
import { assert } from 'chai';
import TreeHandler from '../tree/treeHandler';
import { Tree } from '../types';
import schema from '../schema.json';

describe('tree.TreeHandler', async function () {
  let treeInstance: TreeHandler;
  let name: string;
  let treeObj: Tree;
  const cid = '213082108048320348320483204830';
  const fileName = 'file_with_rt.zip';

  before(async function () {
    treeInstance = new TreeHandler(schema);
  });
  describe('save/load json to tree', async function () {
    it('should save tree object to json file', async function () {
      await treeInstance.save('test_tree', treeInstance.schema);
      const ls = await fs.readdir(path.resolve(__dirname, '../tree'));
      const jsons = ls.filter((file) => file.includes('.json'));
      const founded = jsons.find((file) => file.includes('test_tree'));
      assert.equal(typeof founded, 'string');
    });
    it('should load latest json file to Tree object', async function () {
      const name = await treeInstance.getLast();
      const treeObj = await treeInstance.load(name);
      assert.equal(treeObj instanceof Object, true);
    });
    it('should save 3 json files and get latest json file', async function () {
      await treeInstance.save('test_tree', treeInstance.schema);
      await treeInstance.save('test_tree', treeInstance.schema);

      const ts = Date.now().toString();
      await treeInstance.save('test_tree', treeInstance.schema);
      const name = await treeInstance.getLast();
      assert.isAtLeast(Number(name.split('_')[0]), Number(ts));
    });
    after(async function () {
      const ls = await fs.readdir(path.resolve(__dirname, '../tree'));
      const jsons = ls.filter((file) => file.includes('test_tree.json'));

      for (const json of jsons) {
        await fs.unlink(path.resolve(__dirname, '../tree/'.concat(json)));
      }
    });
  });
  beforeEach(async function () {
    name = await treeInstance.getLast();
    treeObj = await treeInstance.load(name);
  });
  describe('add file metadata to tree', async function () {
    it('should add file name and CID to given branch', async function () {
      const branch = 'oh-root/sarcoma/soft-tissue-sarcoma/liposarcoma/dicom/';

      assert.equal(
        undefined,
        treeObj.children[0].children[0].children[1].children[1].children[0]
          ?.name
      );
      assert.equal(
        undefined,
        treeObj.children[0].children[0].children[1].children[1].children[0]?.CID
      );

      await treeInstance.add(branch, fileName, cid, treeObj);

      assert.equal(
        fileName,
        treeObj.children[0].children[0].children[1].children[1].children[0].name
      );
      assert.equal(
        cid,
        treeObj.children[0].children[0].children[1].children[1].children[0].CID
      );
    });
    it('should throw error: `current tree node name and branch node name mismatch` in case of inconsistency branch and tree', async function () {
      const branchWithTypo =
        'oh_root/sarcoma/soft-tissue-sarcoma/liposarcoma/dicom/';

      let error: string;
      try {
        await treeInstance.add(branchWithTypo, fileName, cid, treeObj);
      } catch (err) {
        error = err;
      }

      assert.equal(
        error,
        'Error: current tree node name and branch node name mismatch'
      );
    });
    it('should throw error: `no such file ... inside tree`', async function () {
      const branchWithNoFileInTree =
        'oh-root/sarcoma/soft-tissue-sarcoma/liposarcoma/fotos/';

      let error: string;
      try {
        await treeInstance.add(branchWithNoFileInTree, fileName, cid, treeObj);
      } catch (err) {
        error = err;
      }
      assert.equal(error, "Error: tree doesn't contain file fotos");
    });
  });
});
