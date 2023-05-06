// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AutocommitProvider } from './autocommitProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let workspaceFolders = vscode.workspace.workspaceFolders;
	let workspaceFoldersPaths: string[] = [];
	workspaceFolders?.map(folder => {
		workspaceFoldersPaths.push(folder.uri.path);
	});

	vscode.window.registerWebviewViewProvider( 'autocommit-scm', new AutocommitProvider(workspaceFoldersPaths, context.extensionUri));

}

// This method is called when your extension is deactivated
export function deactivate() {}
