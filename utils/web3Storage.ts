import { Web3Storage, getFilesFromPath } from 'web3.storage';

/**
 * Get Web3Storage instance created with given api token.
 *
 * @param token api for web3.storage
 * @returns Web3Storage client ganerated based on given api token
 */
export function getWeb3StorageClient(token: string) {
  const client = new Web3Storage({ token });
  return client;
}

/**
 * Store file from your location (pathToFile) on IPFS.
 *
 * @param client instance
 * @param pathToFile from where it should be taken in order to send to ipfs
 * @returns cid content identifier of uploaded file
 * @throws if client doesn't exists
 */
export async function storeFiles(client: Web3Storage, pathToFile: string) {
  if (client === undefined || client === null) {
    throw new Web3ClientError();
  }

  const files = await getFilesFromPath(pathToFile);
  const cid = await client.put(files);
  return cid;
}

/**
 * Retrieve files from IPFS based on givem CID.
 *
 * @param client instance
 * @param cid content identifier which you would like to retrive from ipfs
 * @returns files retrived from ipfs based on given cid
 * @throws if client doesn't exists | if client not responded as expected
 */
export async function retrieveFiles(client: Web3Storage, cid: string) {
  if (client === undefined || client === null) {
    throw new Web3ClientError();
  }
  const res = await client.get(cid);

  if (res === null) {
    throw new Web3ResponseError(`Get with CID ${cid} give null.`);
  }

  const files = await res.files();

  for (const file of files) {
    console.log(`${file.cid}: ${file.name} (${file.size} bytes)`);
  }
  return files;
}

class Web3ResponseError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class Web3ClientError extends Error {
  constructor() {
    super('Client not available.');
  }
}
