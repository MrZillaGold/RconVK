import RconTS from "rcon-ts";
import logs from "logplease";
import VKIO from "vk-io";
import commonTags from "common-tags";

import config from "./config";

const { Rcon } = RconTS;
const { VK } = VKIO
const { servers, token } = config;

const vk = new VK();

const { updates, api } = vk;
const { stripIndents } = commonTags;

const log = logs.create("",  {
    showTimestamp: true,
    useLocalTime: true,
    filename: "logs.txt",
    appendFile: true,
});

vk.setOptions({
    token,
    apiMode: "parallel"
});

updates.use((context, next) => {
    if (!context.senderId && context.senderId < 0) return;
    if (context.isGroup) return;

    return next();
});

servers.forEach(({ commands, rcon }) => {
    const { prefix, access, whitelist, blacklist } = commands;
    const { ip, port, password } = rcon;

    updates.hear(new RegExp(`^(?:${prefix})([^]+)?`, "i"), async (context) => {
        const server = new Rcon({
            host: ip,
            port,
            password,
            timeout: 5000
        });

        if (access.length > 0 && !access.includes(context.senderId))  {
            return context.send("⚠ У вас нет прав для использования команд Rcon!");
        }
        if (blacklist.length > 0 && blacklist.find((command) => context.$match[1].match(new RegExp(`(^(?:${command}) ([^]+))|(^(?:${command})$)`, "i")))) {
            return context.send("⚠ Эта команда запрещена для использования!");
        }
        if (whitelist.length > 0 && !whitelist.find((command) => context.$match[1].match(new RegExp(`(^(?:${command}) ([^]+))|(^(?:${command})$)`, "i")))) {
            return context.send("⚠ Эта команда не находится в списке разрешенных!");
        }

        let loader = null;

        await context.send("⏰ Подключение к серверу...")
            .then(messageId => loader = messageId);

        await server.session(session => session.send(context.$match[1]))
            .then(response =>
                context.send(stripIndents`
                        💡 Ответ от сервера:
                        
                        ${response === "" ? "Команда выполнена!" : response.replace(/§./g, "").slice(0, 4000)}
                        `)
            )
            .catch(error => {
                return context.send(stripIndents`
                ⚠ Ошибка при подключении к серверу ${ip}: ${error}.
                
                Возможно сервер выключен.
                `);
            });

        api.messages.delete({
            message_ids: loader,
            delete_for_all: 1
        });

        log.info(`Пользователь: @id${context.senderId} Команда: ${prefix}${context.$match[1]}`);
    });
});

updates.startPolling()
    .then(() =>
        console.log("[RconVK] Подключен к ВКонтакте.")
    )
    .catch(error =>
        console.log(stripIndents`
        [RconVK] Ошибка при подключении к ВКонтакте.
        ${error}
        `)
    );
