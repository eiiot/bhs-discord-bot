import fs from 'fs';

let emails = JSON.parse(fs.readFileSync('emails.json', 'utf8'));

var unverifiedUsers = '';

for (let i = 0; i < emails.length; i++) {
  const user = emails[i];
  if (user.version !== 2) {
    unverifiedUsers += `<@${user.id}>\n`;
  }
};

fs.writeFileSync('unverifiedUsers.txt', unverifiedUsers);
  