export interface IPhpMethodArgument {
  name?: string;
  nullable?: boolean;
  readonly?: boolean;
  value?: string;
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
  use?: string[];
  implements?: string[];
  extends?: string;
  isFinal?: boolean;
  isAbstract?: boolean;
  isAnonymous?: boolean;
  methods?: IPhpMethod[];
}