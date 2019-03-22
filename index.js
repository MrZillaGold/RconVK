const {VK} = require('vk-io');
const vk = new VK();
const commands = [];
const {updates, snippets} = vk;
const fs = require("fs");
const request = require('prequest');
const Rcon = require('modern-rcon');
const acc = require("./base/acc.json");

vk.setOptions({
    token: '8d72553616a5ce375153522a4c6641e9c7ef4fe4b17b347a0be177a87f5a316e74c79766afa78307e7fdd',
    apiMode: 'parallel',
	pollingGroupId: 175914098
});

let users = [233731786, 247146574, 3, 4, 5];

vk.updates.hear(/^(?:rcon)\s?([^]+)?/i, async (message) => {
  if (users.includes(message.senderId)) {
  await rcon.connect();
  const response = await rcon.send(`${message.$match[1]}`);
  return Promise.all([
    message.send(`💡 Ответ от сервера:`),
    message.send(response),
    rcon.disconnect()
  ]);
} else {
  message.send('⚠ У вас нет прав!');
}
});


updates.startPolling()
.then(() => {
	console.log(`Rcon started!`);
})



















const rcon = new Rcon('18.185.112.254', port = 19132, 'poupoupou2004');