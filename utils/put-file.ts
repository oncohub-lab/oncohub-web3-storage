import { Web3Storage, getFilesFromPath } from 'web3.storage';

function getWeb3StorageClient(token: string) {
  const client = new Web3Storage({ token });
  return client;
}

export async function storeFiles(path_to_file: string) {
  let client: Web3Storage;
  let cid: string = '';
  if (process.env['WEB3_STORAGE_API_KEY'] !== undefined) {
    client = getWeb3StorageClient(process.env['WEB3_STORAGE_API_KEY']);
    const files = await getFilesFromPath(path_to_file);
    cid = await client.put(files);
  }

  return cid;
}
