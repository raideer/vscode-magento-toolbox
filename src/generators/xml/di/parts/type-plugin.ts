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
  constructor(name: string, type: string) {
    super(
      {
        name,
        type,
      },
    );
  }

  getKey() {
    return 'plugin';
  }
}