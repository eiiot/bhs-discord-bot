import fetch from 'node-fetch';

const url = 'https://mee6.xyz/api/plugins/levels/leaderboard/762412666521124866';

const getUsers = async () => {
  const response = await fetch('https://mee6.xyz/api/plugins/levels/leaderboard/762412666521124866');
  const data = await response.json();
  return data;
};

getUsers().then(users => {

  // convert json to array
  const usersArray = JSON.parse(JSON.stringify(users));

  console.log(usersArray.players[0].username);

  for (let i = 0; i < usersArray.players.length; i++) {
    console.log(usersArray.players[i].level);
  }
});