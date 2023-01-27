import { assert } from 'chai';
import { Web3Storage } from 'web3.storage';
import { getWeb3StorageClient } from '../utils/web3Storage';

import * as dotenv from 'dotenv';
dotenv.config();

describe('utils.web3Storage', async function () {
  describe('create web3Storage client', async function () {
    it('should create client with string as token api', async function () {
      const client = getWeb3StorageClient('abc');
      assert.equal(client instanceof Web3Storage, true);
    });
  });

  describe('read content from ipfs', async function () {
    let client: Web3Storage;
    const VALID_CID =
      'bafybeidd2gyhagleh47qeg77xqndy2qy3yzn4vkxmk775bg2t5lpuy7pcu';

    beforeEach(async function () {
      client = getWeb3StorageClient(process.env.WEB3_STORAGE_API_TOKEN);
    });

    it('get with proper cid should return 200 status', async function () {
      const res = await client.get(VALID_CID);
      assert.equal(res.status, 200);
    });

    it('response should include files array with some items', async function () {
      const res = await client.get(VALID_CID);
      const files = await res.files();
      assert.equal(files instanceof Array, true);
      assert.equal(files.length > 0, true);
    });
  });
});
