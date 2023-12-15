import { Uri, workspace } from 'vscode';
import { Builder, parseString } from 'xml2js';

export async function parseXml(xml: string): Promise<null | Object> {
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

export async function loadXml(uri: Uri) {
  let xml: null | Object = null;

  try {
    xml = await workspace.fs
      .readFile(uri)
      .then((buffer) => parseXml(buffer.toString()));
  } catch (e) {
    // File does not exist
  }

  return xml;
}

export function buildXml(object: Object) {
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