import { XmlPart } from 'generators/xml/generator';
import { DiTypeArgument } from './type-argument';

/**
 * Represents <arguments> element in di.xml.
 *
 * <type name="...">
 *   <arguments>
 *    {{children}}
 *  </arguments>
 * </type>
 *
 */
export class DiTypeArguments extends XmlPart {
  constructor(children: DiTypeArgument[] = []) {
    super({}, children);
  }

  getKey() {
    return 'arguments';
  }
}
