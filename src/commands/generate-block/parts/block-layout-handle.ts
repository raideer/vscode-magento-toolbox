import { capitalize, snakeCase } from 'lodash-es';
import { Uri, workspace } from 'vscode';
import { generateBlockLayoutHandleXml } from 'generators/generateBlockLayoutHandleXml';
import { loadXml, parseXml } from 'utils/xml';
import { generateBlockTemplate } from 'generators/generateBlockTemplate';
import { BlockWizardLayoutHandleData } from '../block-wizard';
import { LayoutHandleFactory } from 'generators/layout-handle-xml';
import { LayoutBodyBlock } from 'generators/layout-handle-xml/parts/body-block';
import { LayoutBody } from 'generators/layout-handle-xml/parts/body';
import { LayoutBodyReference } from 'generators/layout-handle-xml/parts/body-reference';

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

  const existing = loadXml(layoutHandleUri);
  const layoutHandle = new LayoutHandleFactory();
  const block = new LayoutBodyBlock(
    blockClassNamespace,
    blockTemplateName,
    `${vendor}_${module}::${blockTemplateName}.phtml`
  );
  const container = new LayoutBodyReference(
    data.referenceType,
    data.referenceName,
    [
      block
    ]
  )
  const body = new LayoutBody([container]);
  layoutHandle.generator.addItem(body);

  return layoutHandle.toString(existing);
};
