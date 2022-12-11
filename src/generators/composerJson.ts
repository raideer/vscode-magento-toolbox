import { License } from 'types';

export interface IComposerVariables {
  vendor: string;
  module: string;
  name: string;
  description: string;
  license: License;
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
}: IComposerVariables) {
  return JSON.stringify(
    {
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
    },
    null,
    4
  );
}
