﻿var mdns = require('mdns2'),
    browser = mdns.createBrowser(mdns.tcp('ipp'));

browser.on('serviceUp', function (rec) {
    console.log(rec.name, 'http://' + rec.host + ':' + rec.port + '/' + rec.txtRecord.rp);
});
browser.start();