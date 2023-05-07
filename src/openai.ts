import { Configuration, OpenAIApi } from "openai";
import {config as configDotenv} from 'dotenv';
import {resolve} from 'path';

configDotenv({path: resolve(__dirname, "../.env")});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

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

const askGPT = async (diffs:string) => {
  if (diffs.trim().length === 0) {
    return{
      error: {
        message: "There are no staged changes. Please stage your changes first.",
      }
    };
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role:"user", "content": generatePrompt(diffs)}],
      temperature: 0.2,
    });
    return {result: completion.data.choices[0].message?.content};
  } catch(error:any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
        return{error: error.response.data};
    } else {
      return{
        error: {
          message: `Error with OpenAI API request: ${error.message}`,
        }
      };
    }
  }
};

export default askGPT;
