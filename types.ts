export interface Tree {
  name: string;
  CID?: string;
  size?: number;
  children?: Array<Tree>;
}
