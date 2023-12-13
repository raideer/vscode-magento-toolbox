import { IXmlPart } from "types/generator";
import { LayoutBodyReference } from "./body-reference";

type LayoutBodyChildren = LayoutBodyReference;

export class LayoutBody implements IXmlPart {
  constructor(private children: LayoutBodyChildren[] = []) {}

  getKey() {
    return 'body';
  }

  addItem(item: LayoutBodyChildren) {
    this.children.push(item);
  }

  toXmlObject() {
    return {
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