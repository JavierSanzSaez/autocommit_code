import { execSync } from "child_process";
import * as vscode from 'vscode';

export function getGitFolders(){
	let workspaceFolders = vscode.workspace.workspaceFolders;
    let workspaceFoldersPaths: string[] = [];

    workspaceFolders?.forEach((folder: any) => {
        let gitCommand = `find ${folder.uri.path} -name "*.git";`;
        const bashResult = execSync(gitCommand).toString();
        const repos = bashResult.split('\n');
        repos.forEach((repo:string) => {
            if (repo){
                workspaceFoldersPaths.push(`${repo.substring(0,repo.length-5)}`);
            }
        });
    });

    return workspaceFoldersPaths;
}

export function generateDiff(path: string) {
    let gitCommand = `cd ${path};git --no-pager diff --cached`;
    
    const bashResult = execSync(gitCommand).toString();
    
    return bashResult;
};

export function processGPTResponse(response: string | undefined) {
    const options = response?.replaceAll("- ","").split("\n").slice(0, 5);
    const summary = response?.split("Summary: ")[1];
    return {options, summary};
};