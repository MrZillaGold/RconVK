const token = "Токен группы ВКонтакте";
const id = 1; // ID Группы вк. Например: https://vk.com/public175914098, ID = 175914098. (БУКВЕННЫЙ ID НЕ РАБОТАЕТ).
const ip = "127.0.0.1"; // IP-Адрес сервера. Домены тоже работают.
const rconPort = 19132; // Rcon порт.
const password = "пароль"; // Rcon пароль.
const users = [233731786, 2, 3, 4, 5];
// ID пользователей ВКонтакте (через запятую) кто сможет взаимодействовать с ботом, всем остальным запрещено.
// Например: https://vk.com/id233731786, ID = 233731786

const {VK} = require('vk-io');
const vk = new VK();
const {updates} = vk;
const {Rcon} = require('rcon-ts');

const rcon = new Rcon({
    host: ip,
    port: rconPort,
    password: password,
    timeout: 5000
});

vk.setOptions({
    token: token,
    apiMode: 'parallel',
    pollingGroupId: id
});

vk.updates.use((context, next) => {
    if (!context.senderId) return;

    if (context.senderId < 0) return;

    if (context.isGroup) return;

    if (context.is('message') && context.isOutbox) return;

    return next();
});

// Вы можете изменить ↓ префикс команд. По умолчанию /. Например: /help
vk.updates.hear(/^(?:\/)([^]+)?/i, (context) => {
    if (users.includes(context.senderId)) {
        context.send("⏰ Подключение к серверу...");
        rcon.connect()
            .then(() => {
            rcon.send(`${context.$match[1]}`)
                .then(res => {
                    context.send(`💡 Ответ от сервера:\n\n${res === "" ? "Команда выполнена!" :  res.replace(/§./g, '').slice(0, 4000)}`);
                    return rcon.disconnect();
                })
                .catch(err => {
                    return context.send(`⚠ Ошибка: ${err}.`);
                });
        })
            .catch(err => {
                return context.send(`⚠ Ошибка при подключении к серверу: ${err}.\n\nВозможно сервер выключен.`);
            });
    } else {
        return context.send('⚠ У вас нет прав для использования команд Rcon!');
    }
});

updates.startPolling()
    .then(() => {
        console.log("Успешно подключен к ВКонтакте.");
    });
