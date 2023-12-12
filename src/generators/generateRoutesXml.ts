import { mergeXml } from 'utils/xml/merge';
import { Builder } from 'xml2js';

export interface IRoutesXmlVariables {
  routeName: string;
  frontName: string;
  module: string;
  routerId: string;
  before?: string;
}

/**
 * Generates routes.xml file
 */
export function generateRoutesXml(variables: IRoutesXmlVariables, initialObject: any = {}) {
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

  const before = variables.before
    ? {
        before: variables.before,
      }
    : {};

  const routesXmlObject = {
    config: {
      $: {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:noNamespaceSchemaLocation': 'urn:magento:framework:App/etc/routes.xsd',
      },
      router: [
        {
          $: {
            id: variables.routerId,
          },
          route: [
            {
              $: {
                id: variables.routeName,
                frontName: variables.frontName,
              },
              module: [
                {
                  $: {
                    name: variables.module,
                    ...before,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  };

  return xmlBuilder.buildObject(
    mergeXml(initialObject, routesXmlObject)
  );
}
