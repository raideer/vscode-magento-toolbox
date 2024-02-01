import { XmlPart } from 'generators/xml/generator';
import { LayoutBodyReference } from './body-reference';

type LayoutBodyChildren = LayoutBodyReference;

export class LayoutBody extends XmlPart {
  constructor(children: LayoutBodyChildren[] = []) {
    super({}, children);
  }

  getKey() {
    return 'body';
  }
}
