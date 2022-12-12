import { mergeWith } from 'lodash-es';
import { parseString } from 'xml2js';

export async function parseXml(xml: string) {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

export function mergeXml(initial: any, target: any) {
  return mergeWith(
    { ...initial },
    {
      ...target,
    },
    (objValue, srcValue) => {
      if (Array.isArray(objValue)) {
        return objValue.concat(srcValue);
      }

      return undefined;
    }
  );
}
