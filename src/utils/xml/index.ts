import { readFile } from 'utils/vscode';
import { Uri } from 'vscode';
import { Builder, ParserOptions, parseString } from 'xml2js';

const PARSE_OPTIONS: ParserOptions = {
  preserveChildrenOrder: true,
};

export async function parseXml(xml: string): Promise<null | Record<string, any>> {
  return new Promise((resolve, reject) => {
    parseString(xml, PARSE_OPTIONS, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

export async function loadXml(uri: Uri) {
  let xml: null | Record<string, any> = null;

  try {
    xml = await readFile(uri).then((string) => parseXml(string));
  } catch (e) {
    // Do nothing
  }

  return xml;
}

export function buildXml(object: Record<string, any>) {
  const xmlBuilder = new Builder({
    xmldec: {
      version: '1.0',
    },
    renderOpts: {
      pretty: true,
      indent: '    ',
      newline: '\n',
    },
  });

  return xmlBuilder.buildObject(object);
}
