import chalk from "chalk";
import * as openclaw from "./openclaw.js";

export function validateSecretFormat(
  secretName: string,
  value: string
): void {
  if (secretName.includes("OPENAI") && !value.startsWith("sk-")) {
    throw new Error(
      `${secretName} appears invalid. OpenAI API keys start with "sk-". ` +
        `Check your key at https://platform.openai.com/api-keys`
    );
  }
}

export async function setSecrets(requiredSecrets: string[]): Promise<void> {
  for (const secretName of requiredSecrets) {
    const envValue = process.env[secretName];

    if (envValue) {
      validateSecretFormat(secretName, envValue);
      await openclaw.setSecret(secretName, envValue);
      console.log(chalk.green(`\n    Set ${secretName} from environment`));
    } else {
      console.log(
        chalk.yellow(
          `\n    ${secretName} not found in environment — skipping (set it later with: openclaw config set secrets.${secretName} <value>)`
        )
      );
    }
  }
}
