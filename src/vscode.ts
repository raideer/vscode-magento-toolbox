import { OpenDialogOptions, Uri, window, workspace } from 'vscode';

export async function openTextDialog(prompt: string, placeHolder?: string, value?: string){
    const result = await window.showInputBox({
        prompt,
        placeHolder,
        value
    });

    return result;
}

export async function openDirectoryDialog(title?: string) {
    const options: OpenDialogOptions = {
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        defaultUri: workspace.workspaceFolders && workspace.workspaceFolders[0].uri,
        title
    };

    const result: Uri[] | undefined = await window.showOpenDialog(Object.assign(options));
    
    if (result && result.length) {
        return Promise.resolve(result[0]);
    } else {
        return Promise.reject();
    }
}