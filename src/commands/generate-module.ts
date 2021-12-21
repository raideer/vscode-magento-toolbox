import * as fs from 'fs';
import { generateModuleRegistration } from "../generator";
import { resolveAppCode } from "../utils";
import { openDirectoryDialog, openTextDialog } from "../vscode";

export default async function() {
    const moduleName = await openTextDialog('Enter module name', 'Vendor name (eg. Vendor_Module)', 'Vendor_Module');
    if (!moduleName) {
        return;
    }

    let targetLocation = await resolveAppCode();

    if (!targetLocation) {
        targetLocation = await openDirectoryDialog('Select module directory (eg. app/code)');
    }

    if (!targetLocation) {
        return;
    }
    
    const [vendor, module] = moduleName.split('_');
    const moduleDirectory = `${targetLocation.fsPath}/${vendor}/${module}`;

    const registration = await generateModuleRegistration({
        moduleName,
        license: null
    });
    
    fs.mkdirSync(moduleDirectory, { recursive: true });
    fs.writeFileSync(`${moduleDirectory}/registration.php`, Buffer.from(registration, 'utf-8'));
}