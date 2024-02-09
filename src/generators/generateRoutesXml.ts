import { buildXml } from 'utils/xml';
import { mergeXml } from 'utils/xml/merge';

export interface RoutesXmlVariables {
  routeName: string;
  frontName: string;
  module: string;
  routerId: string;
  before?: string;
}

/**
 * Generates routes.xml file
 */
export function generateRoutesXml(variables: RoutesXmlVariables, initialObject: any = {}) {
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

  return buildXml(mergeXml(initialObject, routesXmlObject));
}
