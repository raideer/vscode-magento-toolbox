import { XmlPart } from 'generators/xml/generator';
import { LayoutBodyBlock } from './body-block';

type ReferenceContainerChildren = LayoutBodyBlock;

export class LayoutBodyReference extends XmlPart {
  constructor(
    private referenceType: 'block' | 'container',
    name: string,
    children: ReferenceContainerChildren[]
  ) {
    super(
      {
        name,
      },
      children
    );
  }

  getKey() {
    if (this.referenceType === 'block') {
      return 'referenceBlock';
    }

    return 'referenceContainer';
  }
}
