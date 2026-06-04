const express = require('express')
const path = require('path')
const { startBot } = require('./bot')

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.post('/pair', async (req, res) => {
    const number = req.body.number
    if(!number) return res.send('❌ Please enter a number')

    try {
        const code = await startBot(number)
        res.send(`<h2>🔑 Pairing Code for ${number}: ${code}</h2>`)
    } catch (err) {
        res.send(`<h2>Error: ${err.message}</h2>`)
    }
})

app.listen(3000, () => {
    console.log('🌍 Malvin C Vpn site running on http://localhost:3000')
})
