import { IXmlPart } from "types/generator";

export class LayoutBodyBlock implements IXmlPart {
  constructor(private block: string, private name: string, private template: string) {}

  getKey() {
    return 'block';
  }

  toXmlObject() {
    return {
      $: {
        class: this.block,
        name: this.name,
        template: this.template,
      },
    };
  }
}