export interface IClassVariables {
    namespace: string;
    dependencies: string[];
    className: string;
    classExtends: string|null;
    classImplements: string|null;
    data: string;
    license: string|null;
}