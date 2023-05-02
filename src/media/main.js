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
            for (let suggestion of element.commitSuggestions){
                const li = document.createElement('li');
                li.className = 'color-entry';
                const input = document.createElement('input');
                input.className = 'color-input';
                input.type = 'text';
                input.value = suggestion;
                li.appendChild(input);

                ul.appendChild(li);
            }
        });
    }


}());
