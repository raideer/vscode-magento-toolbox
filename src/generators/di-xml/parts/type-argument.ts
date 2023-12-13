import { IXmlPart } from "types/generator";

export class DiTypeArgument implements IXmlPart {
  constructor(private name: string, private xsiType: string, private value: string) {}

  getKey() {
    return 'argument';
  }

  toXmlObject() {
    return {
      $: {
        name: this.name,
        xsiType: this.xsiType,
      },
      _: this.value
    };
  }
}
