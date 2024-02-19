import { buildXml } from 'utils/xml';
import { mergeXml } from 'utils/xml/merge';

export interface IEventsXmlVariables {
  eventName: string;
  observerName: string;
  observerInstance: string;
}

/**
 * Generates events.xml file
 */
export function generateEventsXml(variables: IEventsXmlVariables, initialObject: any = {}) {
  const moduleXmlObject: any = mergeXml(initialObject, {
    config: {
      $: {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:noNamespaceSchemaLocation': 'urn:magento:framework:Event/etc/events.xsd',
      },
      event: [
        {
          $: {
            name: variables.eventName,
          },
          observer: [
            {
              $: {
                name: variables.observerName,
                instance: variables.observerInstance,
              },
            },
          ],
        },
      ],
    },
  });

  return buildXml(moduleXmlObject);
}
