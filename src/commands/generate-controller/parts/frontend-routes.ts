import { Uri, workspace } from 'vscode';
import { parseXml } from 'utils/xml';
import { generateRoutesXml } from 'generators/generateRoutesXml';
import { snakeCase } from 'lodash-es';
import { ControllerWizardData } from '../controller-wizard';

export const generateFrontendRoutes = async (data: ControllerWizardData, appCodeUri: Uri) => {
  const [vendor, module] = data.module.split('_');
  const moduleDirectory = Uri.joinPath(appCodeUri, `${vendor}/${module}`);

  // Generate view/scope/layout/layout_handle_name.xml
  const routesXmlUri = Uri.joinPath(moduleDirectory, `etc/${data.scope}/routes.xml`);

  let existing: any = {};

  try {
    existing = await workspace.fs
      .readFile(routesXmlUri)
      .then((buffer) => parseXml(buffer.toString()));
  } catch (e) {
    // File does not exist
  }

  let frontName = (data.frontName || module).toLowerCase();
  frontName = snakeCase(frontName);

  const routesXml = generateRoutesXml(
    {
      routerId: data.scope === 'frontend' ? 'standard' : 'admin',
      module: data.module,
      routeName: frontName,
      frontName,
      before: data.scope === 'frontend' ? undefined : 'Magento_Backend',
    },
    existing
  );

  return routesXml;
};
