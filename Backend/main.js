const {spawn} = require('child_process');
const execsync = require('child_process').execSync
const cors = require('cors');
const dns = require('dns');

let exec = require('child_process').exec;
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
   
        str = "";
        res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        const traceroute = spawn('traceroute',['-m', '20', '-w' ,'1', req.query.value] )
        traceroute.stdout.on('data', (data) => {
            str += data.toString();

             let lines = str.split("\n");
            for(let i in lines) {
            if(i == lines.length - 1) {
                str = lines[i];
            } else{
                res.write(lines[i] + "\n");
            }
        }
            
          });
          traceroute.on('close', function (code, signal) {
            console.log('child process exited with ' +
                        `code ${code} and signal ${signal}`);
                        res.end(str);                       
        });
        traceroute.stderr.on('data', function (data) {
            res.end('stderr: ' + data);
        });

    
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


function checkIp(ip) {
    return new Promise(function (resolve, reject) {
        let shellCmd = 'ping -c 1 -w 1 ' + ip + ' | grep ttl*';
        exec(shellCmd, function (err, stdout, stderr) {
            if (err) {
                reject(err);
            }
            let result = [];
            if(stdout.includes('64')){
                result.push({ip: ip,active: 'Active Device'})
            }
            
            resolve(result);
        });
    });
}


function resolveDomain(ip) {
    return new Promise(function (resolve, reject) {
        let shellCmd = 'nslookup ' + ip;
        exec(shellCmd, function (err, stdout, stderr) {
            
            let result = [];
            if (stdout.includes('**')) {
                result.push({IP: ip, domain: 'Domain not found'});
            }
            else{
                let res = stdout.toString();
                res = stdout.split('name = ')
                res = res[1].split('.\n')
                result.push({IP: ip, domain: res[0]});
            }
            
            resolve(result);
        });
    });
}

app.get('/scanCompleteNetwork', function(req, res){
    console.log(req.query.ip);
    console.log(req.query.range);

    let ip = ''
    let inicialRange = 1
    let finalRange = req.query.range -1
    //let range = req.query.range -1
    let promises = [];
    let handledIP = req.query.ip.split('.')
    if (handledIP[3] == '0') {
        console.log('es red');
        ip = req.query.ip.slice(0,req.query.ip.length-1)
        for (let i = inicialRange; i < finalRange ; i++) {
            console.log(ip+i);
            promises.push(checkIp(ip + i));
        }
    }else{
        console.log('es un rango');
        ip = req.query.ip.slice(0,req.query.ip.length - handledIP[3].length)
        console.log(ip);
        inicialRange = handledIP[3]
        console.log(inicialRange);
        finalRange = req.query.range -1
        for (let i = inicialRange; i <= finalRange +1; i++) {
            console.log(ip+i);
            promises.push(checkIp(ip + i));
        }
    }
    
  
    Promise.all(promises).then(function (results) {
        let ipDomain = []
        for (let i = 0; i < results.length; i++) {
            if(results[i][0] != null)
            {
                ipDomain.push(resolveDomain(results[i][0].ip))
            }
        }
        Promise.all(ipDomain).then(function (results) {
            res.send(results)
        })
    });

})
  

app.listen(4000);
console.log('Servidor escuchando en puerto 4000');