const config = require("./config");
const servers = config.servers;

const { Rcon } = require("rcon-ts");
const logs = require("logplease");

const { VK } = require("vk-io");
const vk = new VK();
const { updates } = vk;

const log = logs.create("",  {
    showTimestamp: true,
    useLocalTime: true,
    filename: "logs.txt",
    appendFile: true,
});

vk.setOptions({
    token: config.token,
    apiMode: "parallel"
});

updates.use((context, next) => {
    if (!context.senderId) return;
    if (context.senderId < 0) return;
    if (context.isGroup) return;
    if (context.is("message") && context.isOutbox) return;

    return next();
});

servers.forEach(server => {
    const prefix = server.commands.prefix;
    updates.hear(new RegExp(`^(?:${prefix})([^]+)?`, "i"), (context) => {
        const ip = server.rcon.ip;
        const port = server.rcon.port;
        const password = server.rcon.password;

        const access = server.commands.access;
        const whitelist = server.commands.whitelist;
        const blacklist = server.commands.blacklist;

        const rcon = new Rcon({
            host: ip,
            port,
            password,
            timeout: 5000
        });

        if (access.length > 0 && !access.includes(context.senderId)) return context.send("⚠ У вас нет прав для использования команд Rcon!");
        if (blacklist.length > 0 && blacklist.find((command) => context.$match[1].match(new RegExp(`(^(?:${command}) ([^]+))|(^(?:${command})$)`, "i")))) return context.send("⚠ Эта команда запрещена для использования!");
        if (whitelist.length > 0 && !whitelist.find((command) => context.$match[1].match(new RegExp(`(^(?:${command}) ([^]+))|(^(?:${command})$)`, "i")))) return context.send("⚠ Эта команда не находится в списке разрешенных!");

        context.send("⏰ Подключение к серверу...");
        rcon.connect()
            .then(() => {
                rcon.send(context.$match[1])
                    .then(res => {
                        context.send(`💡 Ответ от сервера:\n\n${res === "" ? "Команда выполнена!" :  res.replace(/§./g, "").slice(0, 4000)}`);
                        return rcon.disconnect();
                    })
                    .catch(err => {
                        return context.send(`⚠ Ошибка: ${err}.`);
                    });
            })
            .catch(err => {
                return context.send(`⚠ Ошибка при подключении к серверу ${ip}: ${err}.\n\nВозможно сервер выключен.`);
            });
        log.info(`Пользователь: @id${context.senderId} Команда: ${prefix}${context.$match[1]}`);
    });
});

updates.startPolling()
    .then(() => {
        console.log("[Бот] Подключен к ВКонтакте.");
    });
