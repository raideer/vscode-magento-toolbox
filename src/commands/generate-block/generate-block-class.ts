import { capitalize } from 'lodash-es';
import { generateClass } from 'generators/generateClass';
import { BlockWizardBlockData, BlockWizardLayoutHandleData } from './block-wizard';

export const generateBlockClass = async (
  data: BlockWizardBlockData | BlockWizardLayoutHandleData
) => {
  const [vendor, module] = data.module.split('_');

  const blockName = `${capitalize(data.blockName.replace('Block', ''))}Block`;

  const blockClass = await generateClass({
    namespace: `${vendor}\\${module}\\Block`,
    dependencies: [`Magento\\Framework\\View\\Element\\Template`],
    className: blockName,
    classExtends: 'Template',
    classImplements: null,
    data: '',
    license: null,
  });

  return blockClass;
};
