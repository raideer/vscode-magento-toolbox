import { clone, get, isArray, isObject, isString, merge, mergeWith, over } from 'lodash-es';

const getObjectId: (object:any) => [string | null, string | null] = (object) => {
  for (const path of ['$.id', '$.name']) {
    const id = get(object, path);

    if (id) {
      return [id, path];
    }
  }

  return [null, null];
}

export function mergeXml(initial: Record<string, any>, target: Record<string, any>) {
  const result = {...initial }

  for (let key in target) {
    const value = target[key];
    const initialValue = result[key];

    // If the key does not exist in the initial object, just add it
    if (initialValue=== undefined) {
      result[key] = value;
      continue;
    }
    
    // If is string, overwrite the value
    if (isString(value)) {
      result[key] = value;
      continue;
    }

    // If is object, merge it
    if (isObject(value) && !isArray(value)) {
      
      result[key] = mergeXml(result[key], value);
      continue;
    }

    if (isArray(value)) {
      let original = initialValue;
      const arrayElements: any[] = [];
      
      // loop through it and merge objects with same id
      value.forEach((item, i) => {
        const [itemId, idPath] = getObjectId(item)

        if (!itemId) {
          arrayElements.push(item);
          return;
        }

        let initial = null;

        original = original.filter((initialItem) => {
          if (itemId === get(initialItem, idPath!)) {
            initial = initialItem;
            return false;
          }

          return true;
        })

        if (initial) {
          return arrayElements.push(mergeXml(initial, item));
        } 

        arrayElements.push(item);
      })

      // Add remaining initial elements
      result[key] = [...arrayElements, ...original];
    }
  }

  return result;
}
