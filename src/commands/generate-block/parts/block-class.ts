import { generateClass } from 'generators/template/class';
import { IBlockWizardBlockData, IBlockWizardLayoutHandleData } from '../block-wizard';

export const generateBlockClass = async (
  data: IBlockWizardBlockData | IBlockWizardLayoutHandleData,
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
