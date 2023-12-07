import { IFunctionParam, generateFunction } from 'generators/generateFunction';
import indentString from 'indent-string';
import { generateClassParameter } from 'generators/generateClassParameter';
import { generateClass } from 'generators/generateClass';
import { capitalize } from 'lodash-es';
import { ControllerWizardData } from './controller-wizard';

async function generateExecuteFunctionInner(data: ControllerWizardData) {
  let executeFunctionInner = `// TODO: Implement action`;

  if (data.generateTemplate) {
    executeFunctionInner = `return $this->resultPageFactory->create();`;
  }

  const executeFunction = await generateFunction({
    name: 'execute',
    visibility: 'public',
    description: 'Execute action based on request and return result',
    params: [],
    docParams: [],
    data: indentString(executeFunctionInner, 4),
    returnType: 'ResultInterface|ResponseInterface',
  });

  return executeFunction;
}

async function generateClassParameters() {
  const pageResultFactoryParameter = await generateClassParameter({
    description: null,
    type: 'PageFactory',
    visibility: 'private',
    name: 'resultPageFactory',
  });

  return pageResultFactoryParameter;
}

async function generateClassConstructor(data: ControllerWizardData) {
  const constructorParams: IFunctionParam[] = [];
  const constructorData: string[] = [];

  if (data.inheritAction) {
    constructorParams.push({
      name: 'context',
      type: 'Context',
    });
    constructorData.push('parent::__construct($context);');
  }

  constructorParams.push({
    name: 'resultPageFactory',
    type: 'PageFactory',
  });
  constructorData.push('$this->resultPageFactory = $resultPageFactory;');

  const constructorFunction = await generateFunction({
    name: '__construct',
    visibility: 'public',
    description: 'Constructor',
    params: constructorParams,
    docParams: constructorParams,
    data: indentString(constructorData.join('\n'), 4),
    returnType: 'ResultInterface|ResponseInterface',
  });

  return constructorFunction;
}

const generateControllerClassInner = async (data: ControllerWizardData) => {
  let classInner = '';

  if (data.generateTemplate) {
    classInner += await generateClassParameters();
    classInner += '\n\n';
    classInner += await generateClassConstructor(data);
    classInner += '\n\n';
  }

  const executeFunction = await generateExecuteFunctionInner(data);

  classInner += executeFunction;

  return classInner;
};

const getMethodClass = (method: string) => {
  switch (method) {
    case 'POST':
      return 'HttpPostActionInterface';
    case 'DELETE':
      return 'HttpDeleteActionInterface';
    case 'PUT':
      return 'HttpPutActionInterface';
    default:
      return 'HttpGetActionInterface';
  }
};

export const generateControllerClass = async (data: ControllerWizardData) => {
  const [vendor, module] = data.module.split('_');
  const actionPath = capitalize(data.actionPath);
  const actionName = capitalize(data.actionName);
  const methodClass = getMethodClass(data.method);
  const dependencies = [
    `Magento\\Framework\\App\\Action\\${methodClass}`,
    `Magento\\Framework\\App\\ResponseInterface`,
    `Magento\\Framework\\Controller\\ResultInterface`,
  ];

  if (data.inheritAction) {
    dependencies.push(`Magento\\Framework\\App\\Action\\Action`);
    dependencies.push(`Magento\\Framework\\App\\Action\\Context`);
  }

  if (data.generateTemplate) {
    dependencies.push(`Magento\\Framework\\View\\Result\\PageFactory`);
  }

  const classInner = await generateControllerClassInner(data);
  const controllerClass = await generateClass({
    namespace: `${vendor}\\${module}\\Controller\\${actionPath}`,
    dependencies,
    className: actionName,
    classExtends: data.inheritAction ? `Action` : null,
    classImplements: methodClass,
    data: indentString(classInner, 4),
    license: null,
  });

  return controllerClass;
};
