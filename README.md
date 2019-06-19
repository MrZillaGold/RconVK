# Rcon для ВКонтакте

![Sample](https://psv4.userapi.com/c848224/u2000062961/docs/d8/e117ccf771f7/file.gif?extra=hthTuKoJZGWHyggjrVZZ3i_CNIqslBgKY5JX4wkWZCJh5pRVhv1VbXGTTP-gxtx5WPOZIBozeKDeIuKaLL4iQJ9SgDKv6loMrYmh1GWTx8BXYwajoyZwKay5y3PyfyczdlwIio6T4io5u_bUaknPNByI)

***

`npm i`

Настройка бота для `сообщества`:
1. Открываем файл index.js.
2. Изменяем `const rcon = new Rcon('АЙПИ АДРЕС СЕРВЕРА', port = ПОРТ, 'RCON ПАРОЛЬ');` на ваши данные
3. Access Token:
- Переходим в настройки группы
- Открываем раздел `Работа с API`
- Нажимаем `Создать ключ`
- Отмечаем все галочки и нажимаем `создать`.
- Копируем ключ после его создания и вставляем в строку token.
- Нажимаем `Long Poll API`
- Включаем `Long Poll API`
- Открываем раздел `Сообщения`
- Включаем `Сообщения сообщества`
4. В строку `pollingGroupId` вписываем ID вашей группы VK, к которой будет прикреплён бот.
5. `let users = [1, 2, 3, 4, 5];`
- Вместо 1 2 3 4 5 вы можете вставлять id пользователей ВКонтакте, кто сможет пользоваться командами Rcon, для всех остальных доступ запрещен.
6. Сохраняем файл и выходим.
***
* [by MrZillaGold](https://vk.com/egorlisss) - по всем вопросам

[modern-rcon](https://github.com/levrik/node-modern-rcon) - подключение к Rcon /
 [vk-io](https://github.com/negezor/vk-io) - соединение с ВКонтакте
