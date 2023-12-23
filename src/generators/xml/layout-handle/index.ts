import { buildXml } from 'utils/xml';
import { mergeXml } from 'utils/xml/merge';
import { LayoutBody } from './parts/body';
import { XmlFactory, XmlGenerator } from '../generator';

type LayoutItem = LayoutBody;

class LayoutHandle extends XmlGenerator<LayoutItem> {
  constructor() {
    super([], 'urn:magento:framework:View/Layout/etc/page_configuration.xsd');
  }
}

export class LayoutHandleFactory implements XmlFactory {
  protected generator = new LayoutHandle();

  addItem(item: LayoutItem) {
    this.generator.addItem(item);
  }

  toObject() {
    return this.generator.toXmlObject('page');
  }

  toString(existing?: Object | null) {
    if (!existing) {
      return buildXml(this.toObject());
    }

    return buildXml(mergeXml(existing, this.toObject()));
  }
}
