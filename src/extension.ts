// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { exec } from 'child_process';
import * as vscode from 'vscode';
import { AutocommitProvider } from './autocommitProvider';

class FolderDiff {
	path: string;
	diff: string;

	constructor(path:string,diff:string){
		this.path=path;
		this.diff=diff;
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "autocommit-code" is now active!');

	let workspace_folders = vscode.workspace.workspaceFolders;
	let workspace_folders_paths: string[] = [];
	workspace_folders?.map(folder => {
		workspace_folders_paths.push(folder.uri.path)
	})

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let generateCommitMessage = vscode.commands.registerCommand('autocommit-code.generateCommitMessage', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Calculating diffs...');

		let git_diffs: FolderDiff[] = [];
		let errors: string[] = [];


		workspace_folders?.map(folder => {
			let path = folder.uri.path;
			let git_command = `cd ${path};git --no-pager diff --cached`

			const bash_result = exec(git_command, function(error, stdout, stderr){
				if (stderr){
					errors.push(String(error))
				}
				else{
					git_diffs.push(new FolderDiff(path,stdout));
				}
			});
		});

		console.log(git_diffs);
	});

	context.subscriptions.push(generateCommitMessage);

	vscode.window.registerWebviewViewProvider( 'autocommit-scm', new AutocommitProvider(workspace_folders_paths, context.extensionUri));

}

// This method is called when your extension is deactivated
export function deactivate() {}
