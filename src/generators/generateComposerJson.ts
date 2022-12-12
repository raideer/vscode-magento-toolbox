import { License } from 'types';

export interface IComposerVariables {
  vendor: string;
  module: string;
  name: string;
  description: string;
  license: License;
  version?: string;
}

/**
 * Generates a composer.json file
 */
export function generateComposerJson({
  name,
  description,
  license,
  vendor,
  module,
  version,
}: IComposerVariables) {
  const object: any = {
    name,
    description,
    type: 'magento2-module',
    license,
    'minimum-stability': 'dev',
    require: {},
    autoload: {
      files: ['registration.php'],
      psr4: {
        [`${vendor}\\${module}\\`]: '',
      },
    },
  };

  if (version) {
    object.version = version;
  }

  return JSON.stringify(object, null, 4);
}
