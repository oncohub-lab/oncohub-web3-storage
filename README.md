# oncohub-web3-storage

## Description

### Genesis

Data scientists without data are naked. The First idea was to store data in one of three big cloud players solutions,  like s3, blob or storage. This turned out to be too expensive for non-profit organizations, at least at the beginning (at the time when I am writing it, I'm alone). As data for those storage should be exposed for anyone (open license and anonymize), then in my head arise the idea to implement it on decentralized storage. It turned out to be much cheaper (actually only a tiny fraction of the cloud provider cost).

### Mechanics

![storage-livecycle](./oh-storage.png)

#### Components

Storage
1. web3.storage - is a platform which facilitates access to decentralize storage. Under the hood it uses IPFS as peer-to-peer storage and filecoin as an incentive layer.
2. StorageHandler - handler which allows read and write to web3.storage.

Data presentation
1. TreeHandler - handler which allows to read, save and add branch to Tree object.
2. Tree.json - json like object which is compatible with Apache Echarts type tree.

#### Presentation layer

Because after saving data on IPFS we get CIDs and it is hard to track data structure, so we decided to create an additional layer for presenting our data. We use that tree structure as json to easily translate to Apache Echarts Tree.
After uploading a file on IPFS we collect metadata like: name, CID, size and add it to the proper branch in the Tree.
Besides, the Tree object is also saved on IPFS and thanks to that we can hold only one CID which points to our Tree with all needed metadata.

#### Put it all together

## How to install and run

## How to use

## Team

## License

OncoHub software is released under the [MIT License](LICENSE).