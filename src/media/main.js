// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    let commitSuggestionsEmpty = [];

    var list = document.getElementsByClassName("gpt-path-button");
    for (let element of list) {
        element.addEventListener('click', () => {
            vscode.postMessage({
                command: 'askGPT',
                path: element.value,
            });
        });
        commitSuggestionsEmpty.push({
            path: element.value,
            commitSuggestions: [],
        });
    }

    vscode.setState({ commitSuggestions: commitSuggestionsEmpty });

    let commitSuggestions = vscode.getState() .commitSuggestions;

    updateList(commitSuggestions);

    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.type) {
            case 'GPTResponse':
                {
                    const oldState = vscode.getState();
                    let suggestions = oldState.commitSuggestions;
                    suggestions.forEach((element, index) => {
                        if (element.path === message.path) {
                            suggestions[index] = {
                                path: element.path,
                                commitSuggestions: message.commitSuggestions
                            };
                        }
                    });
                    vscode.setState({commitSuggestions: suggestions});
                    updateList(suggestions);
                    break;
                }
        }
    });

    function updateList(commitSuggestions) {
        commitSuggestions.forEach(element => {
            const ul = document.getElementById(`${element.path}`);
            ul.textContent = '';
            let index = 0;
            for (let suggestion of element.commitSuggestions){
                const li = document.createElement('li');
                li.className = 'color-entry';
                const input = document.createElement('input');
                input.className = 'color-input';
                input.type = 'text';
                input.value = suggestion;
                input.disabled = true;
                li.appendChild(input);

                const copy = document.createElement('a');
                copy.className = 'copy-button';
                copy.ariaLabel = 'Copy commit message';
                copy.addEventListener('click', copyToClipboard);

                const icon = document.createElement('i');
                icon.className = 'codicon codicon-copy';
                copy.appendChild(icon);

                li.appendChild(copy);

                ul.appendChild(li);
                index += 1;
            }
        });
    }

    function copyToClipboard(evt) {

         // Copy the text inside the text field
        navigator.clipboard.writeText(evt.currentTarget.parentNode.firstChild.value);

        vscode.postMessage({
            command: 'CopySuggestion',
        });
    }


}());
