// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    var list = document.getElementsByClassName("gpt-path");
    for (let element of list) {
        element.addEventListener('click', () => {
            vscode.postMessage({
                command: 'askGPT',
                path: element.value,
            });
        });
    }
}());
