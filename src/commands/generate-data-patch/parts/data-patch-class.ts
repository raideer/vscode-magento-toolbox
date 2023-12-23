import { generateClass } from 'generators/template/class';
import { DataPatchWizardData } from '../data-patch-wizard';
import { generateFunction } from 'generators/template/function';
import indentString from 'indent-string';

export const generateDataPatchClassPart = async (data: DataPatchWizardData) => {
  const [vendor, module] = data.module.split('_');

  const use = [
    {
      class: `Magento\\Framework\\Setup\\Patch\\DataPatchInterface`,
      alias: null,
    },
  ];

  const classImplements = ['DataPatchInterface'];

  const classInner = [
    await generateFunction({
      name: 'apply',
      visibility: 'public',
      description: '{@inheritdoc}',
      params: [],
      docParams: [],
      data: indentString('// TODO: Implement apply() method.', 4),
      returnType: null,
    }),
    await generateFunction({
      name: 'getAliases',
      visibility: 'public',
      description: '{@inheritdoc}',
      params: [],
      docParams: [],
      data: indentString(`return [];`, 4),
      returnType: null,
    }),
    await generateFunction({
      name: 'getDependencies',
      visibility: 'public static',
      description: '{@inheritdoc}',
      params: [],
      docParams: [],
      data: indentString(`return [];`, 4),
      returnType: null,
    }),
  ];

  if (data.revertable) {
    use.push({
      class: `Magento\\Framework\\Setup\\Patch\\PatchRevertableInterface`,
      alias: null,
    });

    classImplements.push('PatchRevertableInterface');

    const revertFunction = await generateFunction({
      name: 'revert',
      visibility: 'public',
      description: '{@inheritdoc}',
      params: [],
      docParams: [],
      data: indentString('// TODO: Implement apply() method.', 4),
      returnType: null,
    });

    classInner.push(revertFunction);
  }

  const dataPatchClass = await generateClass({
    namespace: `${vendor}\\${module}\\Setup\\Patch\\Data`,
    use,
    className: data.patchName,
    classExtends: null,
    classImplements: classImplements.join(', '),
    data: indentString(classInner.join('\n\n'), 4),
    license: null,
  });

  return dataPatchClass;
};
