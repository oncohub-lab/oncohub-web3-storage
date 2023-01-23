import { Web3Storage, getFilesFromPath } from 'web3.storage';

export function getWeb3StorageClient(token: string) {
  const client = new Web3Storage({ token });
  return client;
}

export async function storeFiles(client: Web3Storage, pathToFile: string) {
  if (client === undefined || client === null) {
    throw new Web3ClientError();
  }

  const files = await getFilesFromPath(pathToFile);
  const cid = await client.put(files);
  return cid;
}

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
