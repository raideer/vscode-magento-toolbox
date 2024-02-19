import { Uri, workspace } from 'vscode';
import { snakeCase } from 'lodash-es';
import { parseXml } from 'utils/xml';
import { generateEventsXml } from 'generators/generateEventsXml';
import { ObserverWizardData } from '../observer-wizard';

export const generateObserverEvents = async (data: ObserverWizardData, appCodeUri: Uri) => {
  const [vendor, module] = data.module.split('_');
  const moduleDirectory = Uri.joinPath(appCodeUri, `${vendor}/${module}`);

  const variables = {
    eventName: data.eventName,
    observerName: snakeCase(data.observerName),
    observerInstance: `\\${vendor}\\${module}\\Observer\\${data.observerName}`,
  };

  const configLocation = data.scope === 'all' ? 'etc/events.xml' : `etc/${data.scope}/events.xml`;

  let existing: any = {};

  try {
    existing = await workspace.fs
      .readFile(Uri.joinPath(moduleDirectory, configLocation))
      .then((buffer) => parseXml(buffer.toString()));
  } catch (e) {
    // File does not exist
  }

  const eventsXml = generateEventsXml(variables, existing);

  return eventsXml;
};
