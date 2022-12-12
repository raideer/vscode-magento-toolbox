import { Builder } from 'xml2js';

export interface IModuleXmlVariables {
  moduleName: string;
  version?: string;
  sequence?: string[];
}

/**
 * Generates module.xml file
 */
export function generateModuleXml(variables: IModuleXmlVariables) {
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

  const moduleXmlObject: any = {
    config: {
      $: {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:noNamespaceSchemaLocation': 'urn:magento:framework:Module/etc/module.xsd',
      },
      module: {
        $: {
          name: variables.moduleName,
        },
      },
    },
  };

  if (variables.sequence && variables.sequence.length > 0) {
    moduleXmlObject.config.module.sequence = {
      module: variables.sequence.map((item: string) => ({
        $: {
          name: item,
        },
      })),
    };
  }

  return xmlBuilder.buildObject(moduleXmlObject);
}
