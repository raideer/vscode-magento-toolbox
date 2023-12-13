import { IXmlGenerator, IXmlPart } from "types/generator";

export abstract class XmlGenerator<T extends IXmlPart> implements IXmlGenerator {
  protected items: T[] = [];
  protected xsdPath?: string;

  public addItem(item: T) {
    this.items.push(item);
  }

  public getItems() {
    return this.items;
  }

  public toXmlObject(rootElement: string) {
    const head = {
      $: {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
      },
    };

    if (this.xsdPath) {
      head.$['xsi:noNamespaceSchemaLocation'] = this.xsdPath;
    }

    const object = {
      [rootElement]: {
        ...head,
        ...this.items.reduce((acc, item) => {
          if (!acc[item.getKey()]) {
            acc[item.getKey()] = [];
          }
    
          acc[item.getKey()].push(item.toXmlObject());
    
          return acc;
        }, {})
      },
    };

    return object;
  }
}