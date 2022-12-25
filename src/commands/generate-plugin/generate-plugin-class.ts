import { generateClass } from 'generators/generateClass';
import { upperFirst } from 'lodash-es';
import { IFunctionParam, generateFunction } from 'generators/generateFunction';
import { IPhpClass, IPhpMethod } from 'types/reflection';
import indentString from 'indent-string';
import { PluginWizardData } from './plugin-wizard';

const generatePluginClassInner = async (
  data: PluginWizardData,
  methodClass: IPhpClass,
  method: IPhpMethod
) => {
  const pluginMethodName = `${data.type}${upperFirst(method.name)}`;

  const pluginFunctionParams: IFunctionParam[] = [
    {
      name: 'subject',
      type: methodClass.name!,
    },
  ];

  const args = (method.arguments || []).map((argument) => {
    return {
      name: argument.name!,
      type: argument.type!,
    };
  });

  let functionData = '// Plugin code';

  if (data.type === 'before') {
    if (args.length > 0) {
      pluginFunctionParams.push(...args);
      functionData = `return [${args.map((arg) => `$${arg.name}`).join(', ')}]`;
    }
  } else if (data.type === 'after') {
    pluginFunctionParams.push({
      name: 'result',
      type: null,
    });
    functionData = `return $result;`;
  } else if (data.type === 'around') {
    pluginFunctionParams.push({
      name: 'proceed',
      type: 'callable',
    });
    pluginFunctionParams.push(...args);
    functionData = `return $proceed(${args.map((arg) => `$${arg.name}`).join(', ')});`;
  }

  const pluginFunction = await generateFunction({
    name: pluginMethodName,
    visibility: 'public',
    description: null,
    params: pluginFunctionParams,
    docParams: [],
    data: indentString(functionData, 4),
    returnType: null,
  });

  return pluginFunction;
};

export const generatePluginClass = async (
  data: PluginWizardData,
  methodClass: IPhpClass,
  method: IPhpMethod
) => {
  const [vendor, module] = data.module.split('_');
  const nameParts = data.name.split(/[\\/]+/);
  const pluginName = nameParts.pop();
  if (!pluginName) {
    // Just for type safety
    return null;
  }
  const namespace = [vendor, module, 'Plugin', ...nameParts].join('\\');

  const pluginClassInner = await generatePluginClassInner(data, methodClass, method);
  const subjectClass = `${methodClass.namespace}\\${methodClass.name}`;

  const pluginClass = await generateClass({
    namespace,
    dependencies: [subjectClass],
    className: pluginName,
    classExtends: null,
    classImplements: null,
    data: indentString(pluginClassInner, 4),
    license: null,
  });

  return pluginClass;
};
