import indentString from 'indent-string';
import { capitalize } from 'lodash-es';
import { IControllerWizardData } from '../controller-wizard';
import { IFunctionParam, generateFunction } from 'generators/template/function';
import { generateClassParameter } from 'generators/template/class-parameter';
import { generateClass } from 'generators/template/class';

async function generateExecuteFunctionInner(data: IControllerWizardData) {
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

async function generateClassConstructor(data: IControllerWizardData) {
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

const generateControllerClassInner = async (data: IControllerWizardData) => {
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

export const generateControllerClass = async (data: IControllerWizardData) => {
  const [vendor, module] = data.module.split('_');
  const actionPath = capitalize(data.actionPath);
  const actionName = capitalize(data.actionName);
  const methodClass = getMethodClass(data.method);
  const use = [
    {
      class: `Magento\\Framework\\App\\Action\\${methodClass}`,
      alias: null,
    },
    {
      class: `Magento\\Framework\\App\\ResponseInterface`,
      alias: null,
    },
    {
      class: `Magento\\Framework\\Controller\\ResultInterface`,
      alias: null,
    },
  ];

  if (data.inheritAction) {
    use.push({
      class: `Magento\\Framework\\App\\Action\\Action`,
      alias: null,
    });
    use.push({
      class: `Magento\\Framework\\App\\Action\\Context`,
      alias: null,
    });
  }

  if (data.generateTemplate) {
    use.push({
      class: `Magento\\Framework\\View\\Result\\PageFactory`,
      alias: null,
    });
  }

  const classInner = await generateControllerClassInner(data);
  const controllerClass = await generateClass({
    namespace: `${vendor}\\${module}\\Controller\\${actionPath}`,
    use,
    className: actionName,
    classExtends: data.inheritAction ? `Action` : null,
    classImplements: methodClass,
    data: indentString(classInner, 4),
    license: null,
  });

  return controllerClass;
};
