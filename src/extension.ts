// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AutocommitProvider } from './autocommitProvider';
import { getGitFolders } from './common';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const configuration: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('autocommit');
	const privateKey: string|undefined = configuration.get('privateKey');

	if (!privateKey) {
		vscode.window.showInputBox({ prompt: 'Please provide your API key from OpenAi' }).then((privateKey) => {		
			configuration.update('privateKey', privateKey);
		});
	}

	let workspaceFoldersPaths: string[] = getGitFolders();	

	vscode.window.registerWebviewViewProvider( 'autocommit-scm', new AutocommitProvider(workspaceFoldersPaths, context.extensionUri));

}

// This method is called when your extension is deactivated
export function deactivate() {}
