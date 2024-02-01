import { snakeCase } from 'lodash-es';
import { Uri } from 'vscode';
import { loadXml } from 'utils/xml';
import { LayoutHandleFactory } from 'generators/xml/layout-handle';
import { LayoutBodyBlock } from 'generators/xml/layout-handle/parts/body-block';
import { LayoutBodyReference } from 'generators/xml/layout-handle/parts/body-reference';
import { LayoutBody } from 'generators/xml/layout-handle/parts/body';
import { BlockWizardLayoutHandleData } from '../block-wizard';

export const generateBlockLayoutHandlePart = async (
  data: BlockWizardLayoutHandleData,
  moduleDirectory: Uri,
  blockName: string
) => {
  const [vendor, module] = data.module.split('_');

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
  const container = new LayoutBodyReference(data.referenceType, data.referenceName, [block]);
  const body = new LayoutBody([container]);
  layoutHandle.addItem(body);

  return layoutHandle.toString(existing);
};
