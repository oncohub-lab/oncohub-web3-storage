import * as fs from 'fs/promises';
import * as path from 'path';
import { assert } from 'chai';
import TreeHandler from '../tree/treeHandler';
import { Tree } from '../types';
import schema from '../schema.json';
import * as _ from 'underscore';

describe('tree.TreeHandler', async function () {
  let treeInstance: TreeHandler;
  let name: string;
  let treeObj: Tree;
  const cid = '213082108048320348320483204830';
  const size = 1234;
  const fileName = 'file_with_rt.zip';

  before(async function () {
    treeInstance = new TreeHandler();
  });
  describe('save/load json to tree', async function () {
    it('should save tree object to json file', async function () {
      await treeInstance.save('test_tree', __dirname, schema);
      const ls = await fs.readdir(path.resolve(__dirname));
      const jsons = ls.filter((file) => file.includes('.json'));
      const founded = jsons.find((file) => file.includes('test_tree'));
      assert.equal(typeof founded, 'string');
    });
    it('should load latest json file to Tree object', async function () {
      const name = await treeInstance.getLast(__dirname);
      console.log('name: ', name);
      const treeObj = await treeInstance.load(name, __dirname);
      assert.equal(treeObj instanceof Object, true);
    });
    it('should save 3 json files and get latest json file', async function () {
      await treeInstance.save('test_tree', __dirname, schema);
      await treeInstance.save('test_tree', __dirname, schema);

      const ts = Date.now().toString();
      await treeInstance.save('test_tree', __dirname, schema);
      const name = await treeInstance.getLast(__dirname);
      assert.isAtLeast(Number(name.split('_')[0]), Number(ts));
    });
  });
  beforeEach(async function () {
    await treeInstance.save('test_tree', __dirname, schema);
    name = await treeInstance.getLast(__dirname);
    treeObj = await treeInstance.load(name, __dirname);
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

      await treeInstance.add(branch, fileName, cid, size, treeObj);

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
        await treeInstance.add(branchWithTypo, fileName, cid, size, treeObj);
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
        await treeInstance.add(
          branchWithNoFileInTree,
          fileName,
          cid,
          size,
          treeObj
        );
      } catch (err) {
        error = err;
      }
      assert.equal(error, "Error: tree doesn't contain file fotos");
    });
    it('should throw error: `file metadata already exists` and append only one metadata record when attempting to add twice the same to the same branch', async function () {
      const branch = 'oh-root/sarcoma/soft-tissue-sarcoma/liposarcoma/dicom/';

      let error: string;
      try {
        await treeInstance.add(branch, fileName, cid, size, treeObj);
        await treeInstance.add(branch, fileName, cid, size, treeObj);
      } catch (err) {
        error = err;
      }
      const isDuplicated = _.isEqual(
        treeObj.children[0].children[0].children[1].children[1].children[0],
        treeObj.children[0].children[0].children[1].children[1].children[1]
      );

      assert.equal(error, 'Error: file metadata already exists');
      assert.equal(isDuplicated, false);
    });
  });
});
