import { capitalize, snakeCase } from 'lodash-es';
import { Uri, workspace } from 'vscode';
import { generateBlockLayoutHandleXml } from 'generators/generateBlockLayoutHandleXml';
import { parseXml } from 'utils/xml';
import { generateBlockTemplate } from 'generators/generateBlockTemplate';
import { BlockWizardLayoutHandleData } from './block-wizard';

export const generateBlockLayoutHandle = async (
  data: BlockWizardLayoutHandleData,
  appCodeUri: Uri,
  blockName: string
) => {
  const [vendor, module] = data.module.split('_');

  const moduleDirectory = Uri.joinPath(appCodeUri, `${vendor}/${module}`);
  const blockTemplateName = snakeCase(data.blockName);
  const blockClassNamespace = `${vendor}\\${module}\\Block\\${blockName}`;

  // Generate view/scope/layout/layout_handle_name.xml
  const layoutHandleUri = Uri.joinPath(
    moduleDirectory,
    `view/${data.scope}/layout/${data.layoutHandle}.xml`
  );

  let existing: any = {};

  try {
    existing = await workspace.fs
      .readFile(layoutHandleUri)
      .then((buffer) => parseXml(buffer.toString()));
  } catch (e) {
    // File does not exist
  }

  const eventsXml = generateBlockLayoutHandleXml(
    {
      referenceName: data.referenceName,
      referenceType: `reference${capitalize(data.referenceType)}`,
      blockClass: blockClassNamespace,
      blockName: blockTemplateName,
      blockTemplate: `${vendor}_${module}::${blockTemplateName}.phtml`,
    },
    existing
  );

  return eventsXml;
};

export const generateBlockLayoutTemplate = async (moduleName: string, blockName: string) => {
  const [vendor, module] = moduleName.split('_');

  const blockClassNamespace = `${vendor}\\${module}\\Block\\${blockName}`;

  const template = await generateBlockTemplate({
    namespace: blockClassNamespace,
    data: `    Hello from ${blockName}`,
  });

  return template;
};
