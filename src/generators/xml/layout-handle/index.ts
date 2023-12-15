import { buildXml } from "utils/xml";
import { mergeXml } from "utils/xml/merge";
import { IXmlFactory } from "types/generator";
import { LayoutBody } from "./parts/body";
import { XmlGenerator } from "../generator";

type LayoutItem = LayoutBody;

class LayoutHandle extends XmlGenerator<LayoutItem> {
  constructor() {
    super([], 'urn:magento:framework:View/Layout/etc/page_configuration.xsd')
  }
}

export class LayoutHandleFactory implements IXmlFactory {
  public generator = new LayoutHandle();

  toObject() {
    return this.generator.toXmlObject('page');
  }

  toString(existing?: Object | null) {
    if (!existing) {
      return buildXml(this.toObject());
    }

    return buildXml(
      mergeXml(existing, this.toObject())
    );
  }
}