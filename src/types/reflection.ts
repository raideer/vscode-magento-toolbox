export interface IPhpMethodArgument {
  name?: string;
  nullable?: boolean;
  readonly?: boolean;
  value?: any;
  valueRaw?: string;
  type?: string;
}

export interface IPhpMethod {
  name?: string;
  isAbstract?: boolean;
  isFinal?: boolean;
  isStatic?: boolean;
  visibility?: string;
  nullable?: boolean;
  arguments?: IPhpMethodArgument[];
}

export interface IPhpClass {
  namespace?: string;
  name?: string;
  use?: Record<string, string | null>;
  implements?: string[];
  extends?: string;
  isFinal?: boolean;
  isAbstract?: boolean;
  isAnonymous?: boolean;
  methods?: IPhpMethod[];
}
