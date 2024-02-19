import { buildXml } from 'utils/xml';
import { mergeXml } from 'utils/xml/merge';
import { DiType } from './parts/type';
import { DiPreference } from './parts/preference';
import { DiTypePlugin } from './parts/type-plugin';
import { XmlFactory, XmlGenerator } from '../generator';

type DiItem = DiType | DiPreference;

class Di extends XmlGenerator<DiItem> {
  constructor() {
    super([], 'urn:magento:framework:ObjectManager/etc/config.xsd');
  }
}

export class DiFactory implements XmlFactory {
  protected generator = new Di();

  addType(type: DiType) {
    this.generator.addItem(type);
  }

  addPreference(forClass: string, type: string) {
    this.generator.addItem(new DiPreference(forClass, type));
  }

  addPlugin({
    subject,
    plugin,
    name,
    sortOrder,
  }: {
    subject: string;
    plugin: string;
    name: string;
    sortOrder?: number;
  }) {
    const type = new DiType(subject);
    const pluginItem = new DiTypePlugin(name, plugin, sortOrder);
    type.addChild(pluginItem);
    this.generator.addItem(type);
  }

  toObject() {
    return this.generator.toXmlObject('config');
  }

  toString(existing?: Record<string, any> | null) {
    if (!existing) {
      return buildXml(this.toObject());
    }

    return buildXml(mergeXml(existing, this.toObject()));
  }
}
