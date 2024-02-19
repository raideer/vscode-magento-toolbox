import { generateClass } from 'generators/template/class';
import { BlockWizardBlockData, BlockWizardLayoutHandleData } from '../block-wizard';

export const generateBlockClassPart = async (
  data: BlockWizardBlockData | BlockWizardLayoutHandleData,
  blockName: string
) => {
  const [vendor, module] = data.module.split('_');

  const blockClass = await generateClass({
    namespace:
      data.scope === 'frontend'
        ? `${vendor}\\${module}\\Block`
        : `${vendor}\\${module}\\Block\\Adminhtml`,
    use: [
      data.scope === 'frontend'
        ? {
            class: `Magento\\Framework\\View\\Element\\Template`,
            alias: null,
          }
        : {
            class: `Magento\\Backend\\Block\\Template`,
            alias: null,
          },
    ],
    className: blockName,
    classExtends: 'Template',
    classImplements: null,
    data: '',
    license: null,
  });

  return blockClass;
};
