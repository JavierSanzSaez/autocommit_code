"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutocommitProvider = void 0;
const vscode = require("vscode");
class AutocommitProvider {
    constructor(diff_paths) {
        this.diff_paths = diff_paths;
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        let children = [];
        this.diff_paths.forEach((diff_path) => {
            children.push(new PathDiff(diff_path, vscode.TreeItemCollapsibleState.None));
        });
        return Promise.resolve(children);
    }
}
exports.AutocommitProvider = AutocommitProvider;
class PathDiff extends vscode.TreeItem {
    constructor(label, collapsibleState) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.tooltip = `${this.label}`;
    }
}
//# sourceMappingURL=autocommitProvider.js.map