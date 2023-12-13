import { IXmlPart } from "types/generator";
import { DiTypeArguments } from "./type-arguments";
import { DiTypePlugin } from "./type-plugin";

export class DiType implements IXmlPart {
  constructor(private name: string, private children: (DiTypeArguments | DiTypePlugin)[] = []) {}

  getKey() {
    return 'type';
  }

  addItem(item: DiTypeArguments | DiTypePlugin) {
    this.children.push(item);
  }

  toXmlObject() {
    return {
      $: {
        name: this.name,
      },
      ...this.children.reduce((acc, item) => {
        if (!acc[item.getKey()]) {
          acc[item.getKey()] = [];
        }
  
        acc[item.getKey()].push(item.toXmlObject());
  
        return acc;
      }, {})
    };
  }
}