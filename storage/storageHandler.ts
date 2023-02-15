import { Web3Storage, getFilesFromPath } from 'web3.storage';

export default class StorageHandler {
  token: string;
  client: Web3Storage;

  constructor(token: string) {
    this.token = token;
    this.client = new Web3Storage({ token });
  }

  /**
   * Store file from your location (pathToFile) on IPFS.
   *
   * @param pathToFile from where it should be taken in order to send to ipfs
   * @returns cid content identifier of uploaded file
   * @throws if client doesn't exists
   */
  async save(pathToFile: string) {
    if (this.client === undefined || this.client === null) {
      throw new Error('client not available');
    }

    const files = await getFilesFromPath(pathToFile);
    const cid = await this.client.put(files);

    // @ts-ignore
    const sizes = files.map((file) => file.size);
    const size = sizes.reduce((a, b) => a + b, 0);

    return { cid, size };
  }

  /**
   * Retrieve files from IPFS based on givem CID.
   *
   * @param cid content identifier which you would like to retrive from ipfs
   * @returns files retrived from ipfs based on given cid
   * @throws if client doesn't exists | if client not responded as expected
   */
  async load(cid: string) {
    if (this.client === undefined || this.client === null) {
      throw new Error('client not available');
    }
    const res = await this.client.get(cid);

    if (res === null) {
      throw new Error(`Get with CID ${cid} give null.`);
    }

    const files = await res.files();

    for (const file of files) {
      console.log(`${file.cid}: ${file.name} (${file.size} bytes)`);
    }
    return files;
  }
}
