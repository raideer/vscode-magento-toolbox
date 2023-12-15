import { upperFirst } from 'lodash-es';
import { IPhpClass, IPhpMethod } from 'types/reflection';
import indentString from 'indent-string';
import { PluginWizardData } from '../plugin-wizard';
import { IFunctionParam, generateFunction } from 'generators/template/function';
import { IClassUse, generateClass } from 'generators/template/class';

const generatePluginClassInner = async (
  data: PluginWizardData,
  methodClass: IPhpClass,
  method: IPhpMethod
): Promise<[string, IFunctionParam[]]> => {
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
      value: argument.valueRaw,
      nullable: argument.nullable,
    };
  });

  let functionData = '// Plugin code';

  if (data.type === 'before') {
    if (args.length > 0) {
      pluginFunctionParams.push(...args);
      functionData = `return [${args.map((arg) => `$${arg.name}`).join(', ')}];`;
    }
  } else if (data.type === 'after') {
    pluginFunctionParams.push({
      name: 'result',
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

  return [
    pluginFunction,
    pluginFunctionParams
  ];
};

export const generatePluginClass = async (
  data: PluginWizardData,
  methodClass: IPhpClass,
  method: IPhpMethod
) => {
  const [vendor, module] = data.module.split('_');
  const nameParts = data.name.split(/[\\/]+/);
  const pluginName = nameParts.pop() as string;
  const namespace = [vendor, module, 'Plugin', ...nameParts].join('\\');

  const [
    pluginClassInner,
    pluginFunctionParams
  ] = await generatePluginClassInner(data, methodClass, method);
  
  const use: IClassUse[] = pluginFunctionParams.map((param) => {
    if (methodClass.use && methodClass.use[param.type!]) {
      return {
        class: methodClass.use[param.type!]!,
        alias: param.type!
      }
    }

    if (methodClass.name === param.type) {
      return {
        class: methodClass.namespace + '\\' + methodClass.name!,
        alias: null
      }
    }

    return {
      class: param.type!,
      alias: null
    };
  });

  const pluginClass = await generateClass({
    namespace,
    use,
    className: pluginName,
    classExtends: null,
    classImplements: null,
    data: indentString(pluginClassInner, 4),
    license: null,
  });

  return {
    pluginClass,
    namespace
  };
};
