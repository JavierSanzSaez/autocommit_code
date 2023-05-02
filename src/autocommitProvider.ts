import * as vscode from 'vscode';
import { generateDiff } from './common';
import askGPT from './openai';

export class AutocommitProvider implements vscode.WebviewViewProvider{

    private diffPaths: string[];
    private readonly _extensionUri: vscode.Uri;

    private _view?: vscode.WebviewView;

    constructor(diffPaths:string[], extensionUri: vscode.Uri){
        this.diffPaths=diffPaths;
        this._extensionUri = extensionUri;
    }

    public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,

			localResourceRoots: [
				this._extensionUri
			]
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		webviewView.webview.onDidReceiveMessage(data => {
			switch (data.command) {
				case 'askGPT': {
					const diffPath = generateDiff(data.path);
					const diffsGPT = askGPT(diffPath).then((response)=> {
						console.log(response);
						
						if (response.error) {

						}
					});
				}
			}
		});
	}

    private _getHtmlForWebview(webview: vscode.Webview){

        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'src', 'media', 'main.js'));

		// Do the same for the stylesheet.
		const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'src', 'media', 'reset.css'));
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'src', 'media', 'vscode.css'));
		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'src', 'media', 'main.css'));

		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">

            <!--
                Use a content security policy to only allow loading styles from our extension directory,
                and only allow scripts that have a specific nonce.
                (See the 'webview-sample' extension sample for img-src content security policy examples)
            -->
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <link href="${styleResetUri}" rel="stylesheet">
            <link href="${styleVSCodeUri}" rel="stylesheet">
            <link href="${styleMainUri}" rel="stylesheet">

            <title>Cat Colors</title>
        </head>
        <body>
            <ul class="color-list">
            </ul>

			<h2>Current paths:</h2>
			
			${showWorkspacePaths(this.diffPaths)}
			
            <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
        </html>`;
    }
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

function showWorkspacePaths(diffPaths: string[]){
	let result:string = '';

	diffPaths.forEach((path:string)=>{

		let folder = path.split('/').at(-1) || "";

		result += `<div class="path">
			<span>${folder.toUpperCase()}</span>
			<button class="gpt-path" value="${path}">GPT-3 me this!</button>
		</div>`;	
	});
	return result;

}
