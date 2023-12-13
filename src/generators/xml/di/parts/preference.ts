import { IXmlPart } from "types/generator";

export class DiPreference implements IXmlPart {
  constructor(private forClass: string, private type: string) {}

  getKey() {
    return 'preference';
  }

  toXmlObject() {
    return {
      $: {
        for: this.forClass,
        type: this.type,
      },
    };
  }
}
