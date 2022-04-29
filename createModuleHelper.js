import fs from "fs";

const args = process.argv.slice(2);
const commandName = args[0];

const fileText = `export default {
  name: "${commandName}",
  description: "",
  options: [
    // {
    //   name: "", // the name of the option
    //   type: "", // STRING, INTEGER, BOOLEAN, USER, CHOICE
    //   description: "", // the description of the option
    //   required: true, // if the option is required for the command to execute
    // },
  ],
  execute: async (interaction, client, app) => {
    // Write your code here
    },
  permissions: [
    // {
    //   id: "", // the id of the role, or the id of the user
    //   type: "", // ROLE or USER
    //   permission: "" // true or false (if true, the user or role has the permission)
    // }
  ]
}`;

fs.writeFileSync(`./modules/commands/${commandName}.ts`, fileText);

// append the new command to the index.ts file
const indexText = fs.readFileSync("./modules/commands/index.ts", "utf8");
fs.writeFileSync(
  "./modules/commands/index.ts",
  indexText +
    `\nexport { default as ${commandName} } from "./${commandName}.ts";`
);
