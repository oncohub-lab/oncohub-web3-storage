import * as path from 'path';
import { assert } from 'chai';
import { Web3Storage } from 'web3.storage';
import StorageHandler from '../storage/storageHandler';

import * as dotenv from 'dotenv';
dotenv.config();

describe('storage.storageHandler', async () => {
  let storageInstance: StorageHandler;
  beforeEach(async () => {
    storageInstance = new StorageHandler(process.env.WEB3_STORAGE_API_TOKEN);
  });
  describe('check whether Web3Storage client is created', async () => {
    it('should create client instance as Web3Storage', async () => {
      assert.equal(storageInstance.client instanceof Web3Storage, true);
    });
  });

  describe('read content from ipfs', async () => {
    const VALID_CID = 'bafybeidd2gyhagleh47qeg77xqndy2qy3yzn4vkxmk775bg2t5lpuy7pcu';

    it('get with proper cid should return 3 files', async () => {
      const files = await storageInstance.load(VALID_CID);
      assert.equal(files.length, 3);
    });

    it('should store file on ipfs and return cid and name of saved file', async () => {
      const { cid, size } = await storageInstance.save(path.resolve(__dirname, './test_tree.json'));
      assert.equal(cid !== undefined, true);
      assert.equal(size > 0, true);
    });
  });
});
