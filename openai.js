import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (diffs) {

  if (diffs.trim().length === 0) {
    return{
      error: {
        message: "Please enter a valid animal",
      }
    };
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(diffs),
      temperature: 0.2,
    });
    console.log(completion);
    return {result: completion.data.choices[0].text}
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
        return{error: error.response.data}
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      return{
        error: {
          message: 'An error occurred during your request.',
        }
      }
    }
  }
}

function generatePrompt(animal) {
  const diff =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `
  What follows "-------" is a git diff for a potential commit.
    Reply with a markdown unordered list of 5 possible, different Git commit messages 
    (a Git commit message should be concise but also try to describe 
    the important changes in the commit), order the list by what you think 
    would be the best commit message first, and don't include any other text 
    but the 5 messages in your response.
    ------- 
    ${diff}
    -------
    `;
}
