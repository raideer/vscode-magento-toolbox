export interface IXmlPart {
  getKey(): string;
  toXmlObject(): Object;
}

export interface IXmlGenerator {
  addItem(item: IXmlPart): void;
  getItems(): IXmlPart[];
  toXmlObject(rootElement: string): Object;
}

export interface IXmlFactory {
  generator: IXmlGenerator;
  toObject(): Object;
  toString(existing?: Object | null): string;
}