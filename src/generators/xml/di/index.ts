import { buildXml } from "utils/xml";
import { mergeXml } from "utils/xml/merge";
import { DiType } from "./parts/type";
import { DiPreference } from "./parts/preference";
import { DiTypePlugin } from "./parts/type-plugin";
import { IXmlFactory } from "types/generator";
import { XmlGenerator } from "../generator";

type DiItem = DiType | DiPreference;

class Di extends XmlGenerator<DiItem> {
  protected xsdPath = 'urn:magento:framework:ObjectManager/etc/config.xsd';
}

export class DiFactory implements IXmlFactory {
  public generator = new Di();

  addType(type: DiType) {
    this.generator.addItem(type);
  }

  addPreference(forClass: string, type: string) {
    this.generator.addItem(
      new DiPreference(forClass, type)
    );
  }

  addPlugin(subject: string, plugin: string, name: string) {
    const type = new DiType(subject);
    const pluginItem = new DiTypePlugin(name, plugin);
    type.addItem(pluginItem);
    this.generator.addItem(type);
  }

  toObject() {
    return this.generator.toXmlObject('config');
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