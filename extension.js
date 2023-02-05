// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { exec } = require('child_process');
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "autocommit-code" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let generateCommitMessage = vscode.commands.registerCommand('autocommit-code.generateCommitMessage', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Calculating diffs...');

		//  Get the diff including untracked files (see https://stackoverflow.com/a/52093887)
		let git_diffs = [];
		let errors = []

		let workspace_folders = vscode.workspace.workspaceFolders;

		workspace_folders?.map(folder => {
			let path = folder.uri.path;
			let git_command = `cd ${path};git --no-pager diff --cached`

			const bash_result = exec(git_command, function(error, stdout, stderr){
				if (stderr){
					errors.push(error)
				}
				else{
					git_diffs.push({
						path: path,
						diff:stdout
					});
				}
			});
		});

		console.log(git_diffs);
		
	
	});

	context.subscriptions.push(generateCommitMessage);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
