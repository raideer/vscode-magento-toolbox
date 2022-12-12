import { mergeWith } from 'lodash-es';
import { Builder } from 'xml2js';

export interface IEventsXmlVariables {
  eventName: string;
  observerName: string;
  observerInstance: string;
}

/**
 * Generates events.xml file
 */
export function generateEventsXml(variables: IEventsXmlVariables, initialObject: any = {}) {
  const xmlBuilder = new Builder({
    xmldec: {
      version: '1.0',
    },
    renderOpts: {
      pretty: true,
      indent: '    ',
      newline: '\n',
    },
  });

  const moduleXmlObject: any = mergeWith(
    { ...initialObject },
    {
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
    },
    (objValue, srcValue) => {
      if (Array.isArray(objValue)) {
        return objValue.concat(srcValue);
      }

      return undefined;
    }
  );

  return xmlBuilder.buildObject(moduleXmlObject);
}
