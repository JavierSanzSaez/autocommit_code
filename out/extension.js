"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const child_process_1 = require("child_process");
const vscode = require("vscode");
const autocommitProvider_1 = require("./autocommitProvider");
class FolderDiff {
    constructor(path, diff) {
        this.path = path;
        this.diff = diff;
    }
}
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "autocommit-code" is now active!');
    let workspace_folders = vscode.workspace.workspaceFolders;
    let workspace_folders_paths = [];
    workspace_folders?.map(folder => {
        workspace_folders_paths.push(folder.uri.path);
    });
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let generateCommitMessage = vscode.commands.registerCommand('autocommit-code.generateCommitMessage', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Calculating diffs...');
        let git_diffs = [];
        let errors = [];
        workspace_folders?.map(folder => {
            let path = folder.uri.path;
            let git_command = `cd ${path};git --no-pager diff --cached`;
            const bash_result = (0, child_process_1.exec)(git_command, function (error, stdout, stderr) {
                if (stderr) {
                    errors.push(String(error));
                }
                else {
                    git_diffs.push(new FolderDiff(path, stdout));
                }
            });
        });
        console.log(git_diffs);
    });
    context.subscriptions.push(generateCommitMessage);
    vscode.window.registerWebviewViewProvider('autocommit-scm', new autocommitProvider_1.AutocommitProvider(workspace_folders_paths, context.extensionUri));
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map