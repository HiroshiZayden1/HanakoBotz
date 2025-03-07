/**
 📙Script: HanakoBotz
 👤Base: Axel
 👨‍💻Remake: Dxyz - Lxzy
**/

(async () => {
    const {
        default: makeWASocket,
        useMultiFileAuthState,
        jidNormalizedUser,
        fetchLatestBaileysVersion,
        Browsers,
        proto,
        makeInMemoryStore,
        DisconnectReason,
        delay,
        generateWAMessage,
        getAggregateVotesInPollMessage,
        areJidsSameUser,
    } = require("baileys");
    const pino = require("pino");
    const {
        Boom
    } = require("@hapi/boom");
    const chalk = require("chalk");
    const readline = require("node:readline");
    const simple = require("./lib/simple.js");
    const fs = require("node:fs");
    const pkg = require("./package.json");
    const Func = require("./lib/function.js");
    const moment = require("moment-timezone");
    const Queque = require("./lib/queque.js");
    const messageQueue = new Queque();
    const Database = require("./lib/database.js");
    const append = require("./lib/append");
    const serialize = require("./lib/serialize.js");
    const config = require("./settings.js");

    const appenTextMessage = async (m, sock, text, chatUpdate) => {
        const client = conn = DekuGanz = sock
        let messages = await generateWAMessage(
            m.key.remoteJid, {
                text: text,
            }, {
                quoted: m.quoted,
            },
        );
        messages.key.fromMe = areJidsSameUser(participant, sock.user.id);
        messages.key.id = m.key.id;
        messages.pushName = m.pushName;
        if (m.isGroup) messages.participant = participant;
        let msg = {
            ...chatUpdate,
            messages: [proto.WebMessageInfo.fromObject(messages)],
            type: "append",
        };
        return sock.ev.emit("messages.upsert", msg);
    };

    const question = (text) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        return new Promise((resolve) => {
            rl.question(text, resolve);
        });
    };
    global.db = new Database(config.database + ".json");
    await db.init();

    global.pg = new(await require(process.cwd() + "/lib/plugins"))(
        process.cwd() + "/system/plugins",
    );
    await pg.watch();

    global.scraper = new(await require(process.cwd() + "/scrapers"))(
        process.cwd() + "/scrapers/src",
    );
    await scraper.watch();

    setInterval(async () => {
        await db.save();
        await pg.load();
        await scraper.load();
    }, 2000);

    const store = makeInMemoryStore({
        logger: pino().child({
            level: "silent",
            stream: "store",
        }),
    });

    console.log(chalk.blue.bold(`⣿⣿⡿⠉⢋ ⢀⡏⡀⠠⠐  ⠂⢸⢸⣿⡀  ⢰⡀ ⠂ ⠂⠈ ⢈   ⠆⡄ 
⢠⠠⠆⠈⡄ ⣾⠇⡇⠆⡓⠁  ⣿⢸⣿⣷⡀  ⣿⣆⠐⠂⠈ ⢁  ⡀ ⢰⣷⡤
⡇⠈⢇⠁⠁⢰⣿ ⡇⢀⠠⠈⠒⢤⣿⠸⣿⣿⣿⣄ ⠸⣿⣆⢯ ⠄⠐  ⢰⢸⢸⣿⣿
⡇⡆⠟ ⡆⣼⡿ ⣷⠸⡆⠆ ⢸⣿⡆⡏⠻⢿⣿⣦⡘⠬⣿⡼⣇⢀⣆⣤ ⢸⣸⡼⢿⣿
⡇⡇ ⣧⣇⣿⡇⣸⣿⡆⣿⡄⡀⠘⣿⣧⢠⣴⣾⣿⣿⠟⠓⢫⠿⢹⣼⣿⡖ ⢸⣿⣶⣆⣿
⡇⡇ ⣿⣿⣿⣧⣿⣿⣯⡜⣿⣄⡀⢿⡿⣿⠋⠁⣿⣿⣷ ⠘  ⠇⣿⣿ ⣿⣿⡆⣼⣿
⣧⣷ ⣿⣟⠙⠉⣿⣿⡍⠛⢿⡘⢿⣜⣧   ⠋ ⠁     ⠘⢹⣷⣿⡟⣴⣿⣿
⣿⣿⡄⣿⣿⠂ ⠛⠙⠃  ⡇ ⠉⠻            ⢸⣏⣤⣾⣿⣿⣿
⣿⣿⣷⣸⣿      ⠰                ⢠⡏⠉⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣄     ⢠⡀               ⡼  ⣿⢿⣟⠛
⣻⣿⣿⣿⣿⣿⡄    ⠈⠓              ⣰⠃  ⢿⣶⣷⣾
⣿⣿⣯⣿⣿⣿⣿⣆     ⢀⡠⠄⠒⠒ ⠐     ⢀⣼⡏   ⢸⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣷⣤⡀   ⠐⠒⠛⠉⠁    ⣠⣴⣿⣿⠁   ⢸⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⡀      ⢀⣠⣾⣿⢿⣿⠇    ⣸⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣤⣤⣤⣴⣶⣿⣿⠟⠁⣼⡏ ⢀⣠⣶⣿⣿⣿⣿⣿
⣿⣿⡟⣿⣿⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃ ⢰⡿⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟  ⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏ ⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
Welcome to Script Nagi Seishiro Bot / Hiroshi`))
    console.log(chalk.blue.bold(`By: Hiroshi`))

    console.log(chalk.yellow.bold("📁 inisialisasi modul..."));
    console.log(chalk.cyan.bold("- API baileys telah dimuat"));
    console.log(chalk.cyan.bold("- sistem file siap digunakan"));
    console.log(chalk.cyan.bold("- database telah diinisialisasi"));

    console.log(chalk.blue.bold("\n🤖 info bot:"));
    console.log(chalk.white.bold("  | GitHub: ") + chalk.cyan.bold("https://github.com/LeooxzyDekuu"));
    console.log(chalk.white.bold("  | Developer: ") + chalk.green.bold("Hiroshi"));
    console.log(chalk.white.bold("  | Base Script: ") + chalk.green.bold("AxellNetwork"));
    console.log(chalk.white.bold("  | Status Server: ") + chalk.green.bold("Online"));
    console.log(chalk.white.bold("  | Versi: ") + chalk.magenta.bold(pkg.version));
    console.log(chalk.white.bold("  | Versi Node.js: ") + chalk.magenta.bold(process.version));

    console.log(chalk.blue.bold("\n🔁 memuat plugin dan scraper dan case..."))

    async function system() {
        const {
            state,
            saveCreds
        } = await useMultiFileAuthState(config.sessions);
        const sock = simple({
                logger: pino({
                    level: "silent"
                }),
                printQRInTerminal: false,
                auth: state,
                version: [2, 3000, 1019441105],
                browser: Browsers.ubuntu("Edge"),
            },
            store,
        );
        const client = conn = DekuGanz = sock
        store.bind(sock.ev);
        if (!sock.authState.creds.registered) {
            console.log(
                chalk.white.bold(
                    "- Silakan masukkan nomor WhatsApp Anda, misalnya 628xxxx",
                ),
            );
            const phoneNumber = await question(chalk.green.bold(`– Nomor Anda: `));
            const code = await sock.requestPairingCode(phoneNumber, "HIROOOFC")
            setTimeout(() => {
                console.log(chalk.white.bold("- Kode Pairing Anda: " + code));
            }, 3000);
        }

        //=====[ Pembaruan Koneksi ]======
        sock.ev.on("connection.update", async (update) => {
            const {
                connection,
                lastDisconnect
            } = update;
            if (connection === "close") {
                const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
                if (lastDisconnect.error == "Error: Stream Errored (unknown)") {
                    process.exit(0)
                } else if (reason === DisconnectReason.badSession) {
                    console.log(
                        chalk.red.bold("File sesi buruk, Harap hapus sesi dan scan ulang"),
                    );
                    process.exit(0)
                } else if (reason === DisconnectReason.connectionClosed) {
                    console.log(
                        chalk.yellow.bold("Koneksi ditutup, sedang mencoba untuk terhubung kembali..."),
                    );
                    process.exit(0)
                } else if (reason === DisconnectReason.connectionLost) {
                    console.log(
                        chalk.yellow.bold("Koneksi hilang, mencoba untuk terhubung kembali..."),
                    );
                    process.exit(0)
                } else if (reason === DisconnectReason.connectionReplaced) {

                    console.log(
                        chalk.green.bold("Koneksi diganti, sesi lain telah dibuka. Harap tutup sesi yang sedang berjalan."),
                    );
                    sock.logout();
                } else if (reason === DisconnectReason.loggedOut) {
                    console.log(
                        chalk.green.bold("Perangkat logout, harap scan ulang."),
                    );
                    sock.logout();
                } else if (reason === DisconnectReason.restartRequired) {
                    console.log(chalk.green.bold("Restart diperlukan, sedang memulai ulang..."));
                    system();
                } else if (reason === DisconnectReason.timedOut) {
                    console.log(
                        chalk.green.bold("Koneksi waktu habis, sedang mencoba untuk terhubung kembali..."),
                    );
                    process.exit(0)
                }
            } else if (connection === "connecting") {
                console.log(chalk.blue.bold("Menghubungkan ke WhatsApp..."));
            } else if (connection === "open") {
                console.log(chalk.green.bold("Bot berhasil terhubung."));
            }
        });

        //=====[ Setelah Pembaruan Koneksi ]========//
        sock.ev.on("creds.update", saveCreds);

        sock.ev.on("contacts.update", (update) => {
            for (let contact of update) {
                let id = jidNormalizedUser(contact.id);
                if (store && store.contacts)
                    store.contacts[id] = {
                        ...(store.contacts?.[id] || {}),
                        ...(contact || {}),
                    };
            }
        });

        sock.ev.on("contacts.upsert", (update) => {
            for (let contact of update) {
                let id = jidNormalizedUser(contact.id);
                if (store && store.contacts)
                    store.contacts[id] = {
                        ...(contact || {}),
                        isContact: true
                    };
            }
        });

        sock.ev.on("groups.update", (updates) => {
            for (const update of updates) {
                const id = update.id;
                if (store.groupMetadata[id]) {
                    store.groupMetadata[id] = {
                        ...(store.groupMetadata[id] || {}),
                        ...(update || {}),
                    };
                }
            }
        });

        sock.ev.on("group-participants.update", async (groupUpdate) => {
            try {
                let {
                    id,
                    participants,
                    action
                } = groupUpdate;
                let groupMetadata = await sock.groupMetadata(id);
                let totalMembers = groupMetadata.participants.length;

                // Update metadata peserta grup
                const metadata = store.groupMetadata[id] || {
                    participants: []
                };
                if (["add", "revoked_membership_requests"].includes(action)) {
                    metadata.participants.push(
                        ...participants.map((id) => ({
                            id: jidNormalizedUser(id),
                            admin: null,
                        }))
                    );
                } else if (["promote", "demote"].includes(action)) {
                    for (const participant of metadata.participants) {
                        let jid = jidNormalizedUser(participant.id);
                        if (participants.includes(jid)) {
                            participant.admin = action === "promote" ? "admin" : null;
                        }
                    }
                }

                for (let participant of participants) {
                    if (action === "add") {
                        sock.sendMessage(id, {
                            image: {
                                url: "https://files.catbox.moe/j20zmx.jpg"
                            },
                            caption: `Yokoso! (Selamat datang!) Untuk member baru! bernama @${participant.split("@")[0]} ${config.name}-Kun senang sekali bisa bertemu denganmu! *🤩*\nJan Lupa Baca Rules Ya Membaru`,
                            footer: config.name,
                            buttons: [{
                                buttonId: ".menu",
                                buttonText: {
                                    displayText: 'Welcome'
                                }
                            }],
                            viewOnce: true,
                            headerType: 6,
                            contextInfo: {
                                mentionedJid: [participant],
                                isForwarded: !0,
                                forwardingScore: 127,
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: config.saluran,
                                    newsletterName: Func.Styles(`${config.name} By Creator: ${config.ownername}`),
                                    serverMessageId: -1
                                },
                            }
                        });
                    } else if (action === "remove") {
                        sock.sendMessage(id, {
                            image: {
                                url: "https://files.catbox.moe/mk2oik.jpg"
                            },
                            caption: `Sayonara, @${participant.split("@")[0]}-kun! Mata ne! :)`,
                            footer: config.name,
                            buttons: [{
                                buttonId: ".menu",
                                buttonText: {
                                    displayText: 'Goodbye'
                                }
                            }],
                            viewOnce: true,
                            headerType: 6,
                            contextInfo: {
                                mentionedJid: [participant],
                                isForwarded: !0,
                                forwardingScore: 127,
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: config.saluran,
                                    newsletterName: Func.Styles(`${config.name} By Creator: ${config.ownername}`),
                                    serverMessageId: -1
                                },
                            }
                        });
                    }
                }
            } catch (err) {
                console.log(err);
            }
        });

        // antical by lorenzo
        sock.ev.on("call", async (calls) => {
            if (!db.list().settings.anticall) return;
            for (const call of calls) {
                if (!call.id || !call.from) continue;

                let lastTime = lastCall.get(call.from);
                let now = Date.now();

                if (!lastTime || now - lastTime > 5000) {
                    lastCall.set(call.from, now);
                    await sock.rejectCall(call.id, call.from);
                    await sock.sendMessage(call.from, {
                        text: "> 🚫 *Mohon maaf*... Kami tidak bisa menerima telepon dari Anda, anti call aktif!",
                        mentions: [call.from],
                    });
                }
            }
        })

        async function getMessage(key) {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id);
                return msg;
            }
            return {
                conversation: "HanakoBotz",
            };
        }

        sock.ev.on("groups.update", async (updates) => {
            for (const update of updates) {
                const id = update.id;
                const metadata = await store.groupMetadata[id];
                groupCache.set(id, metadata);
                if (store.groupMetadata[id]) {
                    store.groupMetadata[id] = {
                        ...(store.groupMetadata[id] || {}),
                        ...(update || {}),
                    };
                }
            }
        });

        sock.ev.on("messages.upsert", async (cht) => {
            let {
                id
            } = cht;
            let again = new Set()
            // Jika ada pesan masuk
            if (again.has(id)) return
            again.add(id)
            if (cht.messages.length === 0) return;
            const chatUpdate = cht.messages[0];
            if (!chatUpdate.message) return;
            const userId = chatUpdate.key.id;
            global.m = await serialize(chatUpdate, sock, store);
            if (m.isBot) return;
            require("./lib/logger.js")(m);
            if (!m.isOwner && db.list().settings.self) return;
            await require("./system/handler.js")(m, sock, store);
        });

        sock.ev.on("messages.update", async (chatUpdate) => {
            for (const {
                    key,
                    update
                }
                of chatUpdate) {
                if (update.pollUpdates && key.fromMe) {
                    const pollCreation = await getMessage(key);
                    if (pollCreation) {
                        let pollUpdate = await getAggregateVotesInPollMessage({
                            message: pollCreation?.message,
                            pollUpdates: update.pollUpdates,
                        });
                        let toCmd = pollUpdate.filter((v) => v.voters.length !== 0)[0]
                            ?.name;
                        console.log(toCmd);
                        await appenTextMessage(m, sock, toCmd, pollCreation);
                        await sock.sendMessage(m.cht, {
                            delete: key
                        });
                    } else return false;
                    return;
                }
            }
        });
        return sock;
    }
    system();
})();
