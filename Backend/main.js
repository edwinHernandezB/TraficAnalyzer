const {spawn} = require('child_process');
const execsync = require('child_process').execSync
const cors = require('cors');
const dns = require('dns');

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
    console.log(req.query.netstatOptions);
    exec('netstat -' + req.query.netstatOptions, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          res.end(`Error has ocurred: ${error}`)
          return;
        }else{
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
            res.write(stdout)
            res.end()
            console.log(`stdout: ${stdout}`);
        }
    });    
})

app.get('/killProcess', function(req, res){
    let partnerList = req.query.processPID;

    for (let index = 0; index < partnerList.length; index++) {
        
        exec('kill ' + partnerList[index], (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          res.end(`Error has ocurred: ${error}`)
          return;
        }else{ 
            console.log('Process killed.');           
        }
    });    
        
    }
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end('Done')
})


app.get('/packetPath', function(req, res){
    
    if (req.query.option == 0) {
        console.log('dentro 0');
        let result = execsync('traceroute ' + req.query.value)
        console.log(result + ' ');
        res.send(result)
        res.end()
        /*exec('traceroute ' + req.query.value, (error, stdout, stderr) => {
          if (error) {
              res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
              console.error(`exec error: ${error}`);
              res.end(`Error has ocurred: ${error}`)
              return;
            }else{
                let _result = []
                let _http = []
                let auxString = stdout.split('\n').map(value => value.match(/[^ |ms]+/g)).splice(1, stdout.length -1)
                res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
                res.send('hola')
                res.end()
                
            }
        })*/
        


    }
    else if (req.query.option == 3) {
        console.log('dentro 3');
        dns.lookup(req.query.value, (err, address, family) => {
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
            res.end(address)
          });
    }else{
        console.log('dentro else');
        exec('nslookup ' + req.query.value, (error, stdout, stderr) => {
            if (error) {
              res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
              console.error(`exec error: ${error}`);
              res.end(`Error has ocurred: ${error}`)
              return;
            }else{ 
                let domain = stdout.split('name = ').pop().split('\n').splice(0,1).toString()
                domain = domain.substring(0,domain.length-1)
                res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
                res.end(domain)
            }
        })
    }
   

    });    
        
   

app.listen(4000);
console.log('Servidor escuchando en puerto 4000');