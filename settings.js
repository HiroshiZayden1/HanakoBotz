const fs = require('node:fs');

const config = {
    owner: ["6282244004772"],
    name: "ɴᴀɢɪ ꜱᴇɪꜱʜɪʀᴏ-ʙᴏᴛᴢᴢ",
    ownername: 'Hiroshi', 
    ownername2: 'Hiroshi',
    prefix: [".", "?", "!", "/", "#"], //Tambahin sendiri prefix nya kalo kurang
    wwagc: 'https://chat.whatsapp.com/JyeT',
    saluran: '12036327919520@newsletter', 
    jidgroupnotif: '12036355712733@g.us', 
    saluran2: '120363335740699@newsletter', 
    jidgroup: '12036326694949@g.us', 
    wach: 'https://whatsapp.com/channel/0029VS3rnc7Jjus03W', 
    sessions: "sessions",
    sticker: {
      packname: "",
      author: ""
    },
   messages: {
      wait: "tunggu sebentar ya bre",
      owner: "lu bukan owner bot",
      premium: "fitur ini khusus user premium",
      group: "fitur ini khusus group",
      botAdmin: "lu siapa bre? sadar ga si lu kalo lu bukan admin group",
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
