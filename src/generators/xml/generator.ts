export interface XmlFactory {
  toObject(): Object;
  toString(existing?: Object | null): string;
}

/**
 * Represents a part of XML document.
 *
 * Examples:
 *
 * <example name="pluginName" type="pluginType">
 *   foobar
 * </example>
 *
 * - "example": key
 * - "name", "type": attributes
 * - "foobar": value
 *
 */
export abstract class XmlPart {
  constructor(
    protected attributes: Record<string, string> = {},
    protected children: XmlPart[] = [],
    protected value?: string | XmlPart[]
  ) {}

  public setAttribute(name: string, value: string) {
    this.attributes[name] = value;
  }

  public addChild(child: XmlPart) {
    this.children.push(child);
  }

  public setValue(value: string | XmlPart[]) {
    this.value = value;
  }

  public getKey(): string {
    throw new Error('getKey() method must be implemented');
  }

  public toXmlObject() {
    const object: Record<string, any> = {};

    for (const key in this.attributes) {
      if (!object.$) {
        object.$ = {};
      }

      object.$[key] = this.attributes[key];
    }

    for (const child of this.children) {
      if (!object[child.getKey()]) {
        object[child.getKey()] = [];
      }

      object[child.getKey()].push(child.toXmlObject());
    }

    if (this.value) {
      object._ = this.value;
    }

    return object;
  }
}

/**
 * Generates XML object and string from XmlParts
 */
export abstract class XmlGenerator<T extends XmlPart> {
  constructor(protected items: T[] = [], protected xsdPath?: string) {}

  public addItem(item: T) {
    this.items.push(item);
  }

  public getItems() {
    return this.items;
  }

  public toXmlObject(rootElement: string) {
    const head = {
      $: {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
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
        }, {}),
      },
    };

    return object;
  }
}
