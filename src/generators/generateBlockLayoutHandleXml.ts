import { mergeXml } from 'utils/xml';
import { Builder } from 'xml2js';

export interface IBlockLayoutHandleXmlVariables {
  referenceName: string;
  referenceType: string;
  blockClass: string;
  blockName: string;
  blockTemplate: string;
}

/**
 * Generates layout_handle_name.xml file
 */
export function generateBlockLayoutHandleXml(
  variables: IBlockLayoutHandleXmlVariables,
  initialObject: any = {}
) {
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

  const blockLayoutHandle: any = mergeXml(initialObject, {
    config: {
      $: {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:noNamespaceSchemaLocation':
          'urn:magento:framework:View/Layout/etc/page_configuration.xsd',
      },
      body: {
        [variables.referenceType]: {
          $: {
            name: variables.referenceName,
          },
          block: {
            $: {
              class: variables.blockClass,
              name: variables.blockName,
              template: variables.blockTemplate,
            },
          },
        },
      },
    },
  });

  return xmlBuilder.buildObject(blockLayoutHandle);
}
