import ReconnectingWebSocket from "reconnecting-websocket";

class WebsocketTools {
    constructor() {
        this.websocket = null;
        this.experimentWebsocket = null;
    }

    async wsConnect(store) {
        return new Promise((resolve, reject) => {
            // Websocket connection
            let websocket = new ReconnectingWebSocket(WS_URL + 'eoss/ws');
            let pingIntervalId = null;

            websocket.onopen = () => {
                console.log('Web Socket Connection Made');

                // --> Start pinging brain api
                pingIntervalId = setInterval(() => {
                    console.log("Ping sent!");
                    websocket.send(JSON.stringify({'msg_type': 'ping'}));
                }, 30000);

                // --> Resolve promise
                this.websocket = websocket;
                resolve();
            };

            websocket.onclose = (event) => {
                console.log("Websockets closed", event);
                clearInterval(pingIntervalId);
            };

            websocket.onmessage = (event) => store.dispatch("onWebsocketsMessage", event);
        });
    }

    async experimentWsConnect() {
        this.experimentWebsocket = new ReconnectingWebSocket(WS_URL + 'experiment');
        this.experimentWebsocket.onopen = function() {
            console.log('Experiment Web Socket Connection Made');
        };
        this.experimentWebsocket.onmessage = function (data) {};
    }

    async wsReconnect() {
        this.websocket.reconnect();
    }

    async experimentWsReconnect() {
        this.experimentWebsocket.reconnect();
    }
}

export let wsTools = new WebsocketTools();
