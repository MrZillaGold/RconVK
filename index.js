const {VK} = require('vk-io');
const vk = new VK();
const {updates} = vk;
const Rcon = require('modern-rcon');

const rcon = new Rcon('АЙПИ АДРЕС СЕРВЕРА', port = RCON ПОРТ, 'RCON ПАРОЛЬ'); // Данные от сервера

vk.setOptions({
    token: 'ТОКЕН ОТ ГРУППЫ', // Токен
    apiMode: 'parallel',
    pollingGroupId: 175914098 // ID Группы
});

let users = [1, 2, 3, 4, 5]; // Доступ для пользователей, всем остальным запрещено.

// Вы можете изменить ↓ префикс команд
vk.updates.hear(/^(?:rcon)\s?([^]+)?/i, async (context) => {
    if (users.includes(context.senderId)) {
        await rcon.connect();
        const response = await rcon.send(`${context.$match[1]}`);
        let res = response.replace(/§./g, '');
        return Promise.all([
            context.send(`💡 Ответ от сервера:\n\n${res !== `` ? res : `Команда выполнена!`}`),
            rcon.disconnect()
        ]);
    } else {
        context.send('⚠ У вас нет прав!');
    }
});

updates.startPolling()
    .then(() => {
        console.log(`Rcon started! by MrZillaGold`);
    });
