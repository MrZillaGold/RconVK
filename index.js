const {VK} = require('vk-io');
const vk = new VK();
const commands = [];
const {updates, snippets} = vk;
const fs = require("fs");
const request = require('prequest');
const Rcon = require('modern-rcon');

const rcon = new Rcon('АЙПИ АДРЕС СЕРВЕРА', port = RCON ПОРТ, 'RCON ПАРОЛЬ'); // Данные от сервера

vk.setOptions({
    token: 'ВАШ ТОКЕН', // Токен
    apiMode: 'parallel',
    pollingGroupId: 175914098 // ID Группы
});

let users = [1, 2, 3, 4, 5]; // Доступ для пользователей, всем остальным запрещено.

vk.updates.hear(/^(?:rcon)\s?([^]+)?/i, async (message) => {
  if (users.includes(message.senderId)) {
  await rcon.connect();
  const response = await rcon.send(`${message.$match[1]}`);
  let res = response.replace(/§./g, '');
  return Promise.all([
    message.send(`💡 Ответ от сервера:\n\n${res}`),
    rcon.disconnect()
  ]);
} else {
  message.send('⚠ У вас нет прав!');
}
});

updates.startPolling()
.then(() => {
	console.log(`Rcon started! by MrZillaGold`);
})
