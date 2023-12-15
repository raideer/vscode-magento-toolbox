import { IXmlPart } from "types/generator";

export class DiTypePlugin implements IXmlPart {
  constructor(private name: string, private type: string) {}

  getKey() {
    return 'plugin';
  }

  toXmlObject() {
    return {
      $: {
        name: this.name,
        type: this.type,
      },
    };
  }
}