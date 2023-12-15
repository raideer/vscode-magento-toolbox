/* eslint-disable no-param-reassign */
import { isString, last } from 'lodash-es';
import { Class, Identifier, Method, Namespace, Program, UseGroup, UseItem } from 'php-parser';
import { IPhpClass, IPhpMethod, IPhpMethodArgument } from 'types/reflection';

const getUseItemName = (item: UseItem) => {
  if (item.alias) {
    return item.alias.name;
  }

  const parts = item.name.split('\\');
  return last(parts)!;
}

const consumeUseGroup = (node: UseGroup, phpClass: IPhpClass) => {
  if (!phpClass.use) {
    phpClass.use = {};
  }

  // UseGroup has invalid types. Should be items instead of item
  for (const item of (node as any).items as UseItem[]) {
    phpClass.use[getUseItemName(item)] = item.name;
  }
};

const consumeMethod = (node: Method, phpClass: IPhpClass) => {
  const phpMethod: IPhpMethod = {};

  phpMethod.name = isString(node.name) ? node.name : node.name.name;
  phpMethod.isAbstract = node.isAbstract;
  phpMethod.isFinal = node.isFinal;
  phpMethod.isStatic = node.isStatic;
  phpMethod.visibility = node.visibility;
  phpMethod.nullable = node.nullable;

  if (node.arguments) {
    phpMethod.arguments = node.arguments.map((item) => {
      const argument: IPhpMethodArgument = {};

      argument.name = isString(item.name) ? item.name : item.name.name;
      argument.nullable = item.nullable;
      argument.readonly = item.readonly;
      argument.type = item.type?.name;
      argument.value = (item.value as any)?.value;
      argument.valueRaw = (item.value as any)?.raw;

      return argument;
    });
  }

  if (!phpClass.methods) {
    phpClass.methods = [];
  }

  phpClass.methods.push(phpMethod);
};

const consumeClass = (node: Class, phpClass: IPhpClass) => {
  phpClass.name = isString(node.name) ? node.name : node.name.name;
  phpClass.isFinal = node.isFinal;
  phpClass.isAbstract = node.isAbstract;
  phpClass.isAnonymous = node.isAnonymous;

  if (node.implements) {
    phpClass.implements = node.implements.map((item: Identifier) => item.name);
  }

  if (node.extends) {
    phpClass.extends = node.extends.name;
  }

  for (const child of node.body) {
    if (child.kind === 'method') {
      consumeMethod(child as Method, phpClass);
    }
  }
};

const consumeNamespace = (node: Namespace, phpClass: IPhpClass) => {
  phpClass.namespace = node.name;

  for (const child of node.children) {
    if (child.kind === 'usegroup') {
      consumeUseGroup(child as UseGroup, phpClass);
    }

    if (child.kind === 'class') {
      consumeClass(child as any, phpClass);
    }
  }
};

const consumeFile = (node: Program, phpClass: IPhpClass) => {
  for (const child of node.children) {
    if (child.kind === 'namespace') {
      consumeNamespace(child as Namespace, phpClass);
    }
  }
};

export const astToPhpClass = (ast: Program) => {
  const phpClass: IPhpClass = {
    use: {},
  };

  consumeFile(ast, phpClass);
  return phpClass;
};
