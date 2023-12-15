import { LayoutBodyReference } from "./body-reference";
import { XmlPart } from "generators/xml/generator";

type LayoutBodyChildren = LayoutBodyReference;

export class LayoutBody extends XmlPart {
  constructor(children: LayoutBodyChildren[] = []) {
    super(
      {},
      children
    );
  }

  getKey() {
    return 'body';
  }
}