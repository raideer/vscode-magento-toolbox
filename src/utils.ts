import { FileType, workspace } from 'vscode';

export async function resolveAppCode() {
    for (const folder in workspace.workspaceFolders) {
        const uri = workspace.workspaceFolders[Number(folder)].uri;
        const appDir = uri.with({ path: uri.path + '/app/code' });
        try {
            const stat = await workspace.fs.stat(appDir);
            if (stat.type === FileType.Directory) {
                return appDir;
            }
        } catch (e) {
            // do nothing
        }
    }

    return null;
}