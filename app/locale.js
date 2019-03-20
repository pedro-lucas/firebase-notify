const i18n = require("i18n");
const electron = require('electron');
let app = electron.app;

if(!app) app = electron.remote.app;

i18n.configure({
    defaultLocale: 'en',
    fallbacks: {"pt": "pt-BR"}, //Add other fallbacks here
    autoReload: false,
    updateFiles: false,
    syncFiles: false,
    directory: __dirname + '/i18n'
});

i18n.setLocale(app.getLocale());
