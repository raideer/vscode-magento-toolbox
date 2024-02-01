import { XmlPart } from 'generators/xml/generator';

export class LayoutBodyBlock extends XmlPart {
  constructor(block: string, name: string, template: string) {
    super({
      block,
      name,
      template,
    });
  }

  getKey() {
    return 'block';
  }
}
