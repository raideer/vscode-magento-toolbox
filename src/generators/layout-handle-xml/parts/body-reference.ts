import { IXmlPart } from "types/generator";
import { LayoutBodyBlock } from "./body-block";

type ReferenceContainerChildren = LayoutBodyBlock;

export class LayoutBodyReference implements IXmlPart {
  constructor(private referenceType: 'block' | 'container', private name: string, private children: ReferenceContainerChildren[]) {}

  getKey() {
    if (this.referenceType === 'block') {
      return 'referenceBlock';
    }

    return 'referenceContainer';
  }

  toXmlObject() {
    return {
      $: {
        name: this.name,
        _: this.children.map((item) => item.toXmlObject()),
      },
    };
  }
}