const fs = require('node:fs');

const config = {
    owner: ["6282244004772"],
    name: "ɴᴀɢɪ ꜱᴇɪꜱʜɪʀᴏ-ʙᴏᴛᴢᴢ",
    ownername: 'Hiroshi', 
    ownername2: 'Hiroshi',
    prefix: [".", "?", "!", "/", "#"], //Tambahin sendiri prefix nya kalo kurang
    wwagc: '',
    saluran: '120363279192@newsletter', 
    jidgroupnotif: '12036326612733@g.us', 
    saluran2: '120363335701699@newsletter', 
    jidgroup: '120363267694949@g.us', 
    wach: 'https://whatsapp.com/channel/0029VadF8c7Jjus03W', 
    sessions: "sessions",
    sticker: {
      packname: "",
      author: ""
    },
   messages: {
      wait: "tunggu sebentar ya bre",
      owner: "lu bukan owner",
      premium: "fitur ini khusus user premium",
      group: "fitur ini khusus group",
      botAdmin: "lu siapa bre? sadar lu bukan admin group",
      grootbotbup: "jadikan bot admin dulu baru bisa akses",
   },
   database: "hanako-db",
   tz: "Asia/Jakarta"
}

module.exports = config

let file = require.resolve(__filename);
fs.watchFile(file, () => {
   fs.unwatchFile(file);
  delete require.cache[file];
});
