import { XmlPart } from 'generators/xml/generator';

/**
 * Represents <argument> element in di.xml.
 *
 * <type name="...">
 *   <arguments>
 *    <argument name="{{name}}" xsi:type="{{xsiType}}">{{value}}</argument>
 *  </arguments>
 * </type>
 *
 */
export class DiTypeArgument extends XmlPart {
  constructor(name: string, xsiType: string, value: string) {
    super(
      {
        name,
        'xsi:type': xsiType,
      },
      [],
      value
    );
  }

  getKey() {
    return 'argument';
  }
}
