import { XmlPart } from "generators/xml/generator";

/**
 * Represents <preference> element in di.xml.
 * 
 * <preference for="{{forClass}}" type="{{type}}" />
 * 
 */
export class DiPreference extends XmlPart {
  constructor(forClass: string, type: string) {
    super(
      {
        for: forClass,
        type,
      },
    );
  }

  getKey() {
    return 'preference';
  }
}
