import { generateClass } from 'generators/template/class';
import { BlockWizardBlockData, BlockWizardLayoutHandleData } from '../block-wizard';

export const generateBlockClass = async (
  data: BlockWizardBlockData | BlockWizardLayoutHandleData,
  blockName: string
) => {
  const [vendor, module] = data.module.split('_');

  const blockClass = await generateClass({
    namespace:
      data.scope === 'frontend'
        ? `${vendor}\\${module}\\Block`
        : `${vendor}\\${module}\\Block\\Adminhtml`,
    dependencies: [
      data.scope === 'frontend'
        ? `Magento\\Framework\\View\\Element\\Template`
        : `Magento\\Backend\\Block\\Template`,
    ],
    className: blockName,
    classExtends: 'Template',
    classImplements: null,
    data: '',
    license: null,
  });

  return blockClass;
};
