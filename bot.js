const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const P = require('pino')
const commands = require('./commands.json')

async function startBot(number) {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info')

    const sock = makeWASocket({
        auth: state,
        logger: P({ level: 'silent' }),
        browser: ['Malvin C Vpn', 'Chrome', '1.0']
    })

    return new Promise((resolve, reject) => {
        sock.ev.on('connection.update', async (update) => {
            const { connection } = update
            if(connection === 'open') {
                try {
                    const code = await sock.requestPairingCode(number.trim())
                    resolve(code)
                } catch (err) {
                    reject(err)
                }
            }
        })

        sock.ev.on('creds.update', saveCreds)

        sock.ev.on('messages.upsert', async ({ messages }) => {
            const msg = messages[0]
            const from = msg.key.remoteJid
            const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text
            if(!body) return

            const command = body.trim().toLowerCase()
            if(commands[command]) {
                await sock.sendMessage(from, { text: commands[command] })
            }
        })
    })
}

module.exports = { startBot }
