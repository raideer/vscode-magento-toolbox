import indentString from 'indent-string';
import { generateClass } from 'generators/template/class';
import { PreferenceWizardDataClass } from '../preference-wizard';

export const generatePreferenceClass = async (
  data: PreferenceWizardDataClass,
  baseNamespaceParts: string[]
) => {
  const [vendor, module] = data.module.split('_');
  const namespace = [vendor, module, ...baseNamespaceParts].join('\\');

  const preferenceClass = await generateClass({
    namespace,
    use: [],
    className: data.className,
    classExtends: null,
    classImplements: null,
    data: indentString('', 4),
    license: null,
  });

  return {
    preferenceClass,
    namespace,
  };
};
