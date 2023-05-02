import { execSync } from "child_process";

export function generateDiff(path: string) {
    let gitCommand = `cd ${path};git --no-pager diff --cached`;
    
    const bashResult = execSync(gitCommand).toString();
    
    return bashResult;
};
