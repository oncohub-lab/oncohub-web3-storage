import * as path from 'path';
import { assert } from 'chai';
import { Web3Storage } from 'web3.storage';
import StorageHandler from '../storage/storageHandler';

import * as dotenv from 'dotenv';
dotenv.config();

describe('storage.storageHandler', async function () {
  let storageInstance: StorageHandler;
  beforeEach(async function () {
    storageInstance = new StorageHandler(process.env.WEB3_STORAGE_API_TOKEN);
  });
  describe('check whether Web3Storage client is created', async function () {
    it('should create client instance as Web3Storage', async function () {
      assert.equal(storageInstance.client instanceof Web3Storage, true);
    });
  });

  describe('read content from ipfs', async function () {
    const VALID_CID =
      'bafybeidd2gyhagleh47qeg77xqndy2qy3yzn4vkxmk775bg2t5lpuy7pcu';

    it('get with proper cid should return 3 files', async function () {
      const files = await storageInstance.load(VALID_CID);
      assert.equal(files.length, 3);
    });

    it('should store file on ipfs and return cid and name of saved file', async function () {
      const { cid, metadata } = await storageInstance.save(
        path.resolve(__dirname, './test_tree.json')
      );
      assert.equal(cid !== undefined, true);
      assert.equal(metadata.length > 0, true);
    });
  });
});
