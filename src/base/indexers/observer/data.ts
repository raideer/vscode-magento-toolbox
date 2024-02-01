import { trimStart } from 'lodash-es';
import { removeExtraSlashes } from 'utils/path';

export interface Observer {
  event: string;
  class: string;
}

export class ObserverIndexerData {
  constructor(public observers: Observer[]) {}

  public getObserverByClass(name: string) {
    for (const observer of this.observers) {
      if (trimStart(removeExtraSlashes(observer.class), '\\') === name) {
        return observer;
      }
    }
  }

  public getObserversByEvent(name: string) {
    return this.observers.filter((observer) => observer.event === name);
  }
}
