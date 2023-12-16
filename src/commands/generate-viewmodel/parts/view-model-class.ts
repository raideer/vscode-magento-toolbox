import { generateClass } from 'generators/template/class';
import { IViewModelWizardBlockData } from '../viewmodel-wizard';

export const generateViewModelClass = async (data: IViewModelWizardBlockData) => {
  const [vendor, module] = data.module.split('_');

  const namespaceParts = [vendor, module, ...data.directory.split('/')];

  const viewModelClass = await generateClass({
    namespace: namespaceParts.join('\\'),
    use: [
      {
        class: `Magento\\Framework\\View\\Element\\Block\\ArgumentInterface`,
        alias: null,
      },
      {
        class: `Magento\\Framework\\DataObject`,
        alias: null,
      },
    ],
    className: data.name,
    classExtends: 'DataObject',
    classImplements: 'ArgumentInterface',
    data: '',
    license: null,
  });

  return viewModelClass;
};
