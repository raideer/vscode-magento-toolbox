export interface IModuleRegistrationVariables {
  moduleName: string;
  license: string | null;
}

export interface IClassVariables {
  namespace: string;
  dependencies: string[];
  className: string;
  classExtends: string | null;
  classImplements: string | null;
  data: string;
  license: string | null;
}

export interface ILicenseVariables {
  year: number;
  copyright: string;
}

export enum License {
  APACHE2 = 'apache2',
  MIT = 'mit',
  GPL_V3 = 'gplv3',
  OSL_V3 = 'oslv3',
}

export interface IComposerVariables {
  vendor: string;
  module: string;
  name: string;
  description: string;
  license: License;
}
