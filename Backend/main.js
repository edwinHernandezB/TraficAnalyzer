const {spawn} = require('child_process');
const cors = require('cors');


var exec = require('child_process').exec;
express = require("express"),
app = express();
app.use(cors());
app.use(express.static(__dirname));

app.get('/ping', function(req, res){
    exec('ping -c '+req.query.count +' '+ req.query.ip, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
          res.end(`Error has ocurred: ${error}`)
          return;
        }else{
            console.log('body: ' + req.query.ip);
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
            res.write(stdout)
            res.end()
            console.log(`stdout: ${stdout}`);
        }
    });
 
})

app.get('/activeSockets', function(req, res){
    exec('netstat -tunlp', (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          res.end(`Error has ocurred: ${error}`)
          return;
        }else{
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
            res.write(stdout)
            res.end()
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        }
    });    
})
app.listen(4000);