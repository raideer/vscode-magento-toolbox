import { IXmlPart } from "types/generator";
import { DiTypeArgument } from "./type-argument";

export class DiTypeArguments implements IXmlPart {
  constructor(private items: DiTypeArgument[] = []) {}

  getKey() {
    return 'arguments';
  }

  addItem(item: DiTypeArgument) {
    this.items.push(item);
  }

  toXmlObject() {
    return {
      _: this.items.map((item) => item.toXmlObject()),
    };
  }
}