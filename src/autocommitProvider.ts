import * as vscode from 'vscode';

export class AutocommitProvider implements vscode.TreeDataProvider<PathDiff>{
    diff_paths: string[];

    constructor(diff_paths:string[]){
        this.diff_paths=diff_paths;
    }

    getTreeItem(element: PathDiff): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: PathDiff | undefined): vscode.ProviderResult<PathDiff[]> {
        let children: PathDiff[] = [];
        this.diff_paths.forEach((diff_path) =>{
            children.push(new PathDiff(diff_path,vscode.TreeItemCollapsibleState.None))
        })
        return Promise.resolve(children)
    }
}

class PathDiff extends vscode.TreeItem{
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ){
        super(label, collapsibleState);
        this.tooltip = `${this.label}`;
    }
}