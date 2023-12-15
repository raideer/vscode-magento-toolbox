import { snakeCase } from 'lodash-es';
import { Uri } from 'vscode';
import { loadXml } from 'utils/xml';
import { IBlockWizardLayoutHandleData } from '../block-wizard';
import { LayoutHandleFactory } from 'generators/xml/layout-handle';
import { LayoutBodyBlock } from 'generators/xml/layout-handle/parts/body-block';
import { LayoutBodyReference } from 'generators/xml/layout-handle/parts/body-reference';
import { LayoutBody } from 'generators/xml/layout-handle/parts/body';

export const generateBlockLayoutHandle = async (
  data: IBlockWizardLayoutHandleData,
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
