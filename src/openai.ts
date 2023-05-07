import { Configuration, OpenAIApi } from "openai";
import * as vscode from 'vscode';

const generatePrompt = (diff: string) => {
  return `
  What follows "-------" is a git diff for a potential commit.
    Reply with a markdown unordered list of 5 possible, different Git commit messages 
    (a Git commit message should be concise but also try to describe the important changes in the commit in maximum 10 words).
    Then, summarize the 5 commit messages in a single and highly concise commit message, adding "Summary:" at the beginning. This summary CANNOT have more than 6 words.
    -------
    ${diff}
    `;
};

const askGPT = async (diffs: string) => {
  if (diffs.trim().length === 0) {
    return {
      error: {
        message: "There are no staged changes. Please stage your changes first.",
      }
    };
  }

  const workspaceConfiguration: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('autocommit');
  let privateKey: any = workspaceConfiguration.get('privateKey');

  if (!privateKey) {
    privateKey = await vscode.window.showInputBox({ prompt: 'Please provide your API key from OpenAi' });

    if (!privateKey) { // a.k.a. The user cancelled the input or wrote nothing
      return {
        error: {
          message: "Please provide your API key from OpenAi",
        }
      };
    }
    else {
      workspaceConfiguration.update('privateKey', privateKey);
    }
  }

  let configuration = new Configuration({
    apiKey: privateKey
  });

  let openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", "content": generatePrompt(diffs) }],
      temperature: 0.2,
    });
    return { result: completion.data.choices[0].message?.content };
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      return { error: error.response.data.error };
    } else {
      return {
        error: {
          message: `Error with OpenAI API request: ${error.message}`,
        }
      };
    }
  }
};

export default askGPT;
