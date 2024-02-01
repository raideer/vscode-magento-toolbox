import { XmlPart } from 'generators/xml/generator';
import { DiTypeArguments } from './type-arguments';
import { DiTypePlugin } from './type-plugin';

/**
 * Represents <type> element in di.xml.
 *
 * <type name="{{name}}">
 *    {{children}}
 *  </type>
 *
 */
export class DiType extends XmlPart {
  constructor(name: string, children: (DiTypeArguments | DiTypePlugin)[] = []) {
    super(
      {
        name,
      },
      children
    );
  }

  getKey() {
    return 'type';
  }
}
