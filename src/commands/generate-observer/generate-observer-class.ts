import { generateFunction } from 'generators/generateFunction';
import { generateClass } from 'generators/generateClass';
import indentString from 'indent-string';
import { ObserverWizardData } from './observer-wizard';

export const generateObserverClass = async (data: ObserverWizardData) => {
  const [vendor, module] = data.module.split('_');
  const observerFunction = await generateFunction({
    name: 'execute',
    visibility: 'public',
    description: 'Execute observer',
    params: [
      {
        name: 'observer',
        type: 'Observer',
      },
    ],
    docParams: [
      {
        name: 'observer',
        type: '\\Magento\\Framework\\Event\\Observer',
      },
    ],
    data: '    // Your code',
    returnType: 'void',
  });

  const observerClass = await generateClass({
    namespace: `${vendor}\\${module}\\Observer`,
    dependencies: [`Magento\\Framework\\Event\\Observer`],
    className: data.observerName,
    classExtends: null,
    classImplements: `\\Magento\\Framework\\Event\\ObserverInterface`,
    data: indentString(observerFunction, 4),
    license: null,
  });

  return observerClass;
};
