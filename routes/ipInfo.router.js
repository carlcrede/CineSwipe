const fetch = require('node-fetch');
const router = require('express').Router();

router.get('/ipinfo', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const response = await fetch(`https://api.db-ip.com/v2/free/${ip}`);
    const ipinfo = await response.json();
    if (ipinfo.countryCode == 'ZZ') {
        ipinfo.countryCode = 'DK';
    }
    res.send(ipinfo);
});

module.exports = {
    router
};