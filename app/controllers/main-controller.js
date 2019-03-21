const Controller = require('./controller');
const ToolbarView = require('../components/toolbar-view');
const $ = require("jquery");
const NotificationView = require('../library/notification-view');
const i18n = require("i18n");
const {
    remote
} = window.require('electron')
const dialog = remote.dialog;
const firebaseAdmin = require("firebase-admin");

class MainController extends Controller {

    constructor() {
        super();
        this.initialize();
        this.app = null;
        this.apps = {};
    }

    initialize() {
        this.toolbarView = new ToolbarView();
        this.addComponent(this.toolbarView, true);

        this.toolbarView.btnSend.on('click', this.actionSend.bind(this));
        this.toolbarView.btnClean.on('click', this.actionClean.bind(this));
        this.fdFile.on('click', this.actionSelectFile.bind(this));

    }

    actionSelectFile() {
        dialog.showOpenDialog(remote.getCurrentWindow(), {
            properties: ['openFile'],
            filters: [{
                name: 'JSON',
                extensions: ['json']
            }],
            message: 'Selecione o arquivo de configuração do firebase administrator'
        }, files => {
            if (files && files.length) {
                try {
                    let project = require(files[0]);
                    if (!project["project_id"]) {
                        throw "Invalid file";
                    }
                    this.lbFile.text(files[0]);
                    this.fdFile.text('1');
                } catch (e) {
                    this.lbFile.text("");
                    this.fdFile.text('0');
                    NotificationView.error('Chave de administração inválida', {
                        dismissable: true
                    });
                }
            }
        });
    }

    actionClean() {
        this.app = null;
        this.lbFile.text("");
        this.fdFile.prop('disabled', false);
        this.toolbarView.btnClean.addClass('hidden');
    }

    actionSend() {

        if (this.app == null) {

            let configFile = this.lbFile.text().trim();
            let config = null;

            try {
                config = require(configFile);
                if(config.project_id === undefined) {
                    throw "Arquivo de projeto inválido";
                }
            } catch (e) {
                NotificationView.error('Arquivo de configuração inválido', {
                    dismissable: true
                });
                return;
            }

            if(this.apps[config.project_id] !== undefined) {
                this.app = this.apps[config.project_id];
            }else{
                this.app = firebaseAdmin.initializeApp({
                    credential: firebaseAdmin.credential.cert(configFile),
                    databaseURL: `https://${config.project_id}.firebaseio.com`
                }, config.project_id);
                this.apps[config.project_id] = this.app;
            }

        }

        if (this.app) {
            this.fdFile.prop('disabled', true);
            this.toolbarView.btnClean.removeClass('hidden');
        } else {
            NotificationView.error('Não foi possível iniciar o app, tente novamente mais tarde', {
                dismissable: true
            });
            return;
        }

        let token = this.fdToken.val().trim();
        let title = this.fdTitle.val().trim();
        let body = this.fdDescription.val().trim();
        let data = {};
        let android = {};
        let apns = {};

        if (token.length < 16) {
            NotificationView.error('Token inválido', {
                dismissable: true
            });
            return;
        } else if (!title.length) {
            NotificationView.error('Título inválido', {
                dismissable: true
            });
            return;
        }

        try {
            data = JSON.parse(this.fdPayload.val())
        } catch (e) {}

        try {
            android = JSON.parse(this.fdAndroid.val())
        } catch (e) {}

        try {
            apns = JSON.parse(this.fdIos.val())
        } catch (e) {}

        let notification = {
            title,
            body
        };

        let message = {
            data,
            notification,
            android,
            apns,
            token
        };

        this.app.messaging().send(message)
            .then(response => {
                NotificationView.success(response.toString(), {
                    dismissable: true
                });
            })
            .catch(error => {
                NotificationView.error(error.message, {
                    dismissable: true
                });
            });

    }

    get view() {
        if (!this._view) this._view = $('.main');
        return this._view;
    }

    get ui() {
        return {
            'lbFile': '.lb-file',
            'fdFile': '.fd-file',
            'fdToken': '.fd-token',
            'fdTitle': '.fd-title',
            'fdDescription': '.fd-description',
            'fdPayload': '.fd-payload',
            'fdAndroid': '.fd-android',
            'fdIos': '.fd-ios'
        };
    }

}

window.rootController = new MainController();