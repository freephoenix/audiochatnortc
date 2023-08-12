//https://audiochatnortc.herokuapp.com/

const fs = require('fs')
const http = require('http');
const ws = require('ws');
const wss = new ws.Server({noServer: true});
const port = process.env.PORT || 3000;

if(!module.parent) {
  http.createServer((req, res)=>{
    function onConnect(ws, wss) {
      ws.on('message', (message)=>{
        console.log(message);
        wss.clients.forEach((client)=>{
          if(client!==ws && client.readyState===ws.OPEN) client.send(message);
        });
      });
    }
    // все входящие запросы должны использовать websockets
    // может быть заголовок Connection: keep-alive, Upgrade
    if (req.headers.upgrade && req.headers.upgrade.toLowerCase() == 'websocket' || req.headers.connection.match(/\bupgrade\b/i)) {
      wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws)=>{return onConnect(ws, wss)});
    } else {
      if(req.method=='GET') {
        let url=req.url.split('/');
        if(url[1]=='') {
          fs.readFile('./index.html', (err, data)=>{
            if(err) return console.error(err.message);
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(data);
            res.end();
          });
        }
      }	// end of GET
    }
  }).listen(port, ()=>console.log(port));
} else {
  exports.accept = accept;
}