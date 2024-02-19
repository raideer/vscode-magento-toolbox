import { upperFirst } from 'lodash-es';
import indentString from 'indent-string';
import { IFunctionParam, generateFunction } from 'generators/template/function';
import { IClassUse, generateClass } from 'generators/template/class';
import { getIdentifierName } from 'base/reflection/ast';
import { PhpClass } from 'base/reflection/php-class';
import { PhpMethod } from 'base/reflection/php-method';
import { PluginWizardData } from '../plugin-wizard';

const generatePluginClassInner = async (
  data: PluginWizardData,
  methodClass: PhpClass,
  method: PhpMethod
): Promise<[string, IFunctionParam[]]> => {
  const pluginMethodName = `${data.type}${upperFirst(method.name as string)}`;

  const pluginFunctionParams: IFunctionParam[] = [
    {
      name: 'subject',
      type: methodClass.name as string,
    },
  ];

  const args = (method.ast.arguments || []).map((argument) => {
    return {
      name: getIdentifierName(argument.name),
      type: argument.type ? getIdentifierName(argument.type) : undefined,
      value: argument.value ? ((argument as any).value.raw as string) : undefined,
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

  return [pluginFunction, pluginFunctionParams];
};

export const generatePluginClass = async (
  data: PluginWizardData,
  methodClass: PhpClass,
  method: PhpMethod
) => {
  const [vendor, module] = data.module.split('_');
  const nameParts = data.name.split(/[\\/]+/);
  const pluginName = nameParts.pop() as string;
  const namespace = [vendor, module, 'Plugin', ...nameParts].join('\\');

  const [pluginClassInner, pluginFunctionParams] = await generatePluginClassInner(
    data,
    methodClass,
    method
  );

  const use: IClassUse[] = pluginFunctionParams
    .filter((param) => param.type)
    .map((param) => {
      const useItem = methodClass.parent.useItems.find((item) => item.name === param.type);

      if (useItem) {
        return {
          class: useItem.fullName,
          alias: param.type!,
        };
      }

      if (methodClass.name === param.type) {
        return {
          class: `${methodClass.parent.namespace}\\${methodClass.name}`,
          alias: null,
        };
      }

      return null;
    })
    .filter((item) => item !== null) as IClassUse[];

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
    namespace,
  };
};
