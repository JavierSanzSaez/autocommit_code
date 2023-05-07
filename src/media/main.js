// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    let workspaceFoldersEmpty = [];

    var list = document.getElementsByClassName("gpt-path-button");
    for (let element of list) {
        element.addEventListener('click', () => {
            vscode.postMessage({
                command: 'askGPT',
                path: element.value,
            });
        });
        workspaceFoldersEmpty.push({
            path: element.value,
            commitSuggestions: [],
            commitSummary: '',
        });
    }

    vscode.setState({ workspaceFolders: workspaceFoldersEmpty });

    let workspaceFolders = vscode.getState().workspaceFolders;

    updateList(workspaceFolders);

    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.type) {
            case 'GPTResponse':
                {
                    const oldState = vscode.getState();
                    let workspaceFolders = oldState.workspaceFolders;
                    workspaceFolders.forEach((element, index) => {
                        if (element.path === message.path) {
                            workspaceFolders[index] = {
                                path: element.path,
                                commitSuggestions: message.commitSuggestions,
                                commitSummary: message.commitSummary,
                            };
                        }
                    });
                    vscode.setState({workspaceFolders: workspaceFolders});
                    updateList(workspaceFolders);
                    break;
                }
            case 'loadingButton': {
                if (message.value){
                    const button = document.getElementById(`button-${message.path}`);
                    button.innerHTML = '';
                    const spinner = document.createElement('i');
                    spinner.className = 'codicon codicon-refresh rotating';
                    button.appendChild(spinner);
                    const span = document.createElement('span');
                    span.className = 'button-span';
                    span.innerHTML = 'Loading...';
                    button.appendChild(span);
                }
                else{
                    const button = document.getElementById(`button-${message.path}`);
                    button.innerHTML = 'GPT-3 me this!';
                }
                break;
            }
        }
    });

    function updateList(workspaceFolders) {
        workspaceFolders.forEach(element => {
            const ul = document.getElementById(`${element.path}`);
            ul.textContent = '';
            let index = 0;
            for (let suggestion of element.commitSuggestions){
                ul.className = 'margin-bottom';
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
            if (element.commitSummary) {
                const ul = document.getElementById(`${element.path}-summary`);
                ul.className = 'top-border';
                ul.textContent = '';

                const liLabel = document.createElement('li');
                liLabel.className = 'color-entry';
                const label = document.createElement('p');
                label.innerHTML = 'Summary:';

                liLabel.appendChild(label);

                const liSummary = document.createElement('li');
                liSummary.className = 'color-entry';

                const input = document.createElement('input');
                input.disabled = true;
                input.value = element.commitSummary;
                input.className = 'color-input';
                input.type = 'text';
                input.id = ' summary';
    

                liSummary.appendChild(input);
                const copy = document.createElement('a');
                copy.className = 'copy-button';
                copy.ariaLabel = 'Copy commit message';
                copy.addEventListener('click', copyToClipboard);

                const icon = document.createElement('i');
                icon.className = 'codicon codicon-copy';
                copy.appendChild(icon);

                liSummary.appendChild(copy);
                ul.appendChild(liLabel);
                ul.appendChild(liSummary);
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
