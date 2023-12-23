import { Uri, window } from 'vscode';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { Wizard, WizardField } from 'types/wizard';
import { ext } from './variables';

export function openWizard<T = any>(wizard: Wizard): Promise<T> {
  return new Promise((resolve, reject) => {
    const panel = window.createWebviewPanel(
      'magentoToolboxDialog',
      wizard.title,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
      }
    );

    const scriptPath = Uri.file(path.join(ext.context.extensionPath, 'dist', 'webview.js'));
    const scriptSrc = panel.webview.asWebviewUri(scriptPath);

    let template = fs.readFileSync(
      `${ext.context.extensionPath}/templates/webview/index.html`,
      'utf8'
    );
    template = template.replace('{{APP_SCRIPT}}', scriptSrc.toString());

    panel.webview.html = template;

    let loaded = false;
    let it: any;

    panel.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case 'loaded':
          loaded = true;
          clearInterval(it);
          panel.webview.postMessage({
            command: 'render-wizard',
            payload: wizard,
          });
          break;
        case 'submit':
          panel.dispose();
          resolve(message.payload);
          break;
        default:
          console.warn('Unknown command');
          break;
      }
    });

    it = setTimeout(() => {
      if (!loaded) {
        panel.dispose();
        reject(new Error('Failed to load webview'));
      }
    }, 5000);
  });
}

export class WizardGenerator {
  private wizard: Wizard = {
    title: '',
    fields: [],
  };

  setTitle(title: string) {
    this.wizard.title = title;
  }

  setDescription(description: string) {
    this.wizard.description = description;
  }

  addField(field: WizardField) {
    this.wizard.fields.push(field);
  }

  setFields(fields: WizardField[]) {
    this.wizard.fields = fields;
  }

  addValidator(field: string, rule: any) {
    this.wizard.validation = this.wizard.validation || {};
    this.wizard.validation[field] = rule;
  }

  setValidation(validation: Record<string, any>) {
    this.wizard.validation = validation;
  }

  public open<T = any>() {
    return openWizard<T>(this.wizard);
  }
}
