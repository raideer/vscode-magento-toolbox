import { XmlPart } from "generators/xml/generator";

/**
 * Represents <plugin> element in di.xml.
 * 
 * <type name="...">
 *    <plugin name="{{name}}" type="{{type}}" />
 * </type>
 * 
 */
export class DiTypePlugin extends XmlPart {
  constructor(name: string, type: string, sortOrder?: number) {
    const attributes: Record<string, string> = {
      name,
      type,
    };

    if (sortOrder) {
      attributes.sortOrder = String(sortOrder);
    }

    super(
      attributes
    );
  }

  getKey() {
    return 'plugin';
  }
}