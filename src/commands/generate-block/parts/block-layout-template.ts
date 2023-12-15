import { generateBlockTemplate } from "generators/template/block-template";

export const generateBlockLayoutTemplate = async (moduleName: string, blockName: string) => {
  const [vendor, module] = moduleName.split('_');

  const blockClassNamespace = `${vendor}\\${module}\\Block\\${blockName}`;

  const template = await generateBlockTemplate({
    namespace: blockClassNamespace,
    data: `    Hello from ${blockName}`,
  });

  return template;
};
