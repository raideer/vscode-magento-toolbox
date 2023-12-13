import { IXmlPart } from "types/generator";

export class DiTypePlugin implements IXmlPart {
  constructor(private name: string, private value: string) {}

  getKey() {
    return 'plugin';
  }

  toXmlObject() {
    return {
      $: {
        name: this.name,
        value: this.value,
      },
    };
  }
}