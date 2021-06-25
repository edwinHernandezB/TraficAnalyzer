
let simulation = []
export default class TCPSettings {

    constructor(seq, mss, window, totalBytes, hostName, maxRTT){
        //Source
        this.seq = seq;
        this.mss = mss;
        this.window = window;
        this.totalBytes = totalBytes;
        this.ack = '-';
        this.flag = 'SYN';
        this.bytesToSend = 0;
        this.hostName = hostName;
        this.connectionEnded = false;
        this.simulation = []
        this.ackCountSlidindWindow = 0;
        this.srcTimer = '-'
        //Destination
        this.dstSeq = 0;
        this.dstMSS = 0;
        this.dstWindow = 0;
        this.dstWindowCount = 0;
        this.flagDst = '-';
        this.totalDstBytes = 0;
        this.dstRmBytes = 0;

        //Round Trip
        //this.RTO = 1 //Tiempo de espera de retransmisión
        this.SRTT //Tiempo de ida y vuelta suavizado
        this.RTTVAR //Ida y vuelta variación de tiempo   //asumimos grnaularidad reloj G segundos
        this.R = 0
        
            this.SRTT = maxRTT
            this.RTTVAR = maxRTT / 2
            this.RTO = this.SRTT + Math.max(6, 4*this.RTTVAR)
            this.max = this.RTO
            if (maxRTT < 10) {
                this.min = maxRTT - 5
            } else {
                this.min = maxRTT - 10
            }
        this.backoffRTT = this.RTO
        this.listBackoffRTT = []

        //Control var
        this.packetLoss = false
        this.isFirst = false

    }

    calculateRTT(){
        return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min; 
    }

    calculateLossSegmentRTT(){
        return Math.floor(Math.random() * ((this.max + 10) - this.max + 1)) + (this.max+1); 
    }

    calculateTcpRetransmision(){
        this.R = this.calculateRTT()
        this.RTTVAR = (1 - 0.25) * this.RTTVAR + 0.25 * Math.abs(this.SRTT - this.R);
        this.SRTT = (1- 0.125) * this.SRTT + 0.125 * this.R;
        let auxRTO = this.SRTT + Math.abs(6, 4*this.RTTVAR);
        this.RTO = auxRTO.toFixed(2)
        
    }

    // TCP connection
    sendSynSegment(dstHost, simulation){
        console.log(`${this.hostName} envia a ${dstHost.hostName} paquete SYN:`);
        dstHost.dstWindow = this.window;
        dstHost.dstWindowCount = this.window;
        dstHost.dstMSS = this.mss;
        dstHost.bytesToSend = this.mss; 
        dstHost.dstSeq = this.seq;
        dstHost.flagDst = this.flag;
        dstHost.printSegment(this.flag, this.ack, this.seq, 0)
        let time = new Date();
        this.srcTimer = time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()+':'+ time.getMilliseconds()
        let rtt = this.calculateRTT()
        console.log(this.srcTimer)
        simulation.push({date: '-', host: this.hostName, flag:this.flag, seq:this.seq, ack:this.ack, bytes:0})
        //console.log(simulation);
    }

    sendSynAck(dstHost, simulation){
        console.log(`${this.hostName} envia a ${dstHost.hostName} paquete SYN-ACK:`);
        dstHost.dstWindow = this.window;
        dstHost.dstWindowCount = this.window;
        dstHost.dstMSS = this.mss;
        dstHost.bytesToSend = this.mss; 
        dstHost.dstSeq = this.seq;
        dstHost.flagDst = 'SYN-ACK';
        this.ack = this.dstSeq + 1;
        let time = new Date()
        this.srcTimer = time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()+':'+ time.getMilliseconds()
        this.rtt = this.calculateRTT()
        this.calculateTcpRetransmision();
        dstHost.printSegment(dstHost.flagDst, this.ack, this.seq, 0)
        simulation.push({date: this.RTO + ' ms', host: this.hostName, flag:dstHost.flagDst, seq:this.seq, ack:this.ack, bytes:0})
        //console.log(simulation);

    }

    sendAck(dstHost, simulation){
        console.log(`${this.hostName} envia a ${dstHost.hostName} paquete ACK:`);
        //dstHost.dstWindow = this.window;
        //dstHost.dstMSS = this.mss;
        this.flagDst = 'ACK';
        dstHost.flagDst = 'ACK'
        this.seq += 1;
        this.ack = dstHost.seq + 1;
        dstHost.seq +=1
        dstHost.printSegment(this.flagDst, this.ack, this.seq, 0)
        let time = new Date()
        this.srcTimer = time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()+':'+ time.getMilliseconds()
        simulation.push({date: '-', host: this.hostName, flag:this.flagDst, seq:this.seq, ack:this.ack,  bytes:0})
        //console.log(this.dstWindow, dstHost.dstWindow);
    }
    sendDataSegment(dstHost, simulation){
        console.log(`${this.hostName} envia un paquete de datos a ${dstHost.hostName}`);
    
        console.log('this.totalBytes >= this.bytesToSend'+this.totalBytes +' '+this.bytesToSend)
        if (this.totalBytes >= this.bytesToSend) {
            console.log('dstHost.mss >= dstHost.window' + this.dstMSS +' '+ this.dstWindow);
            if (dstHost.mss >= dstHost.window) {
                this.bytesToSend = dstHost.window
                this.totalBytes -= this.bytesToSend // Resto el número de bytes enviados al total de bytes que tengo que enviar
                dstHost.totalDstBytes = this.bytesToSend //Registro en el host destino los bytes que se envían en el segmento desde origen        
       
            }else{
                this.bytesToSend = dstHost.mss;
                this.totalBytes -= this.bytesToSend;
                dstHost.totalDstBytes = this.bytesToSend
            }
        }else{
            console.log('else dstHost.mss >= dstHost.window'+dstHost.mss  +' '+dstHost.window)
            if (this.totalBytes <= dstHost.window) {
                this.bytesToSend = this.totalBytes;
                this.totalBytes -= this.bytesToSend;
                dstHost.totalDstBytes = this.bytesToSend

            } else {
                this.bytesToSend = dstHost.window;
            this.totalBytes -= this.bytesToSend;
            dstHost.totalDstBytes = this.bytesToSend
            }

        }
        console.log('totalBytes: '+this.totalBytes +' this.bytesToSend: '+this.bytesToSend)

        dstHost.ackCountSlidindWindow = this.bytesToSend;
        let time = new Date()
        this.srcTimer = time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()+':'+ time.getMilliseconds()
        dstHost.printSegment(this.flagDst, this.ack, this.seq, this.bytesToSend)
        simulation.push({date: '-', host: this.hostName, flag:this.flagDst, seq:this.seq, ack:this.ack, bytes:this.bytesToSend})
        this.seq += this.bytesToSend; //Actualizo la secuencia aumentando los bytes enviados

    }
    
    sendBurstDataSegment(dstHost, simulation){
        console.log(`${this.hostName} envia un paquete de datos burst a ${dstHost.hostName}`);
        console.log('this.totalBytes >= this.bytesToSend'+this.totalBytes +' '+this.bytesToSend)
        if (this.totalBytes >= this.bytesToSend) {
            this.totalBytes -= this.bytesToSend; // Resto el número de bytes enviados al total de bytes que tengo que enviar
            dstHost.totalDstBytes = this.bytesToSend; //Registro en el host destino los bytes que se envían en el segmento desde origen        
        }else{
            this.bytesToSend = this.totalBytes;
            this.totalBytes -= this.bytesToSend;
            dstHost.totalDstBytes = this.bytesToSend
        }
        console.log('totalBytes: '+this.totalBytes +' this.bytesToSend: '+this.bytesToSend)

        dstHost.ackCountSlidindWindow = this.bytesToSend;
        dstHost.ack += this.bytesToSend
        let time = new Date()
        this.srcTimer = time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()+':'+ time.getMilliseconds()
        dstHost.printSegment(this.flagDst, this.ack, this.seq, this.bytesToSend)
        simulation.push({date: '-', host: this.hostName, flag:this.flagDst, seq:this.seq, ack:this.ack, bytes:this.bytesToSend})
        this.seq += this.bytesToSend; //Actualizo la secuencia aumentando los bytes enviados

    }

    sendBurstAckSegment(dstHost, simulation){
        console.log(`${this.hostName} envia un paquete de ACK a ${dstHost.hostName}`);
        this.flag = 'ACK'

        dstHost.totalDstBytes = this.bytesToSend; //Registro en el host destino los bytes que se envían en el segmento desde origen
        dstHost.printSegment(this.flag, this.ack, this.seq, 0)
        let time = new Date()
        this.srcTimer = time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()+':'+ time.getMilliseconds()
        let calRTT = this.calculateRTT()
        this.calculateTcpRetransmision();
        simulation.push({date: this.RTO + ' ms', host: this.hostName, flag:this.flag, seq:this.seq, ack:this.ack, bytes:0})
        //console.log(simulation);
        dstHost.dstWindowCount = dstHost.dstWindow
    }

    sendLossDataSegment(dstHost, simulation){
        console.log(`${this.hostName} reenvia un paquete de datos a ${dstHost.hostName}`);
        let time = new Date()
        this.srcTimer = time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()+':'+ time.getMilliseconds()
        dstHost.printSegment(this.flagDst, this.ack, this.seq - this.bytesToSend, this.bytesToSend)
        if (this.packetLoss) {
            //newTimeout =  * Timeout
            this.calculateTcpRetransmision();
            this.backoffRTT = this.RTO
            this.listBackoffRTT.push(this.RTO)
            this.packetLoss = false;
        }else{
            if(this.listBackoffRTT.length != 0){
                this.RTO = this.listBackoffRTT.pop()
                this.max = this.RTO
            }
            
        }
        simulation.push({date: this.RTO + ' ms', host: this.hostName, flag:this.flagDst, seq:this.seq - this.bytesToSend, ack:this.ack, bytes:this.bytesToSend})
    }

    sendAckSegment(dstHost, simulation){
        console.log(`${this.hostName} envia un paquete de ACK a ${dstHost.hostName}`);
        this.flag = 'ACK'
        this.ack += this.totalDstBytes  // Sumo al ack el siguiente byte que quiero esperar
        
        dstHost.totalDstBytes = this.bytesToSend; //Registro en el host destino los bytes que se envían en el segmento desde origen
        dstHost.printSegment(this.flag, this.ack, this.seq, 0)
        let time = new Date()
        this.srcTimer = time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()+':'+ time.getMilliseconds()
        let calRTT = this.calculateRTT()
        this.calculateTcpRetransmision();
        simulation.push({date: this.RTO + ' ms', host: this.hostName, flag:this.flag, seq:this.seq, ack:this.ack, bytes:0})
        //console.log(simulation);
    }

    sendFinSegment(dstHost, simulation){
        console.log(`${this.hostName} envia un paquete de FIN a ${dstHost.hostName}`);
        this.flag = 'FIN';
        dstHost.flagDst = this.flag;
        this.printSegment(this.flag, this.ack, this.seq, 0)
        let time = new Date()
        this.srcTimer = time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()+':'+ time.getMilliseconds()
        simulation.push({date: '-', host: this.hostName, flag:this.flag, seq:this.seq, ack:this.ack, bytes:0})
        //console.log(simulation);
    }

    sendFinAckSegment(dstHost, simulation){
        console.log(`${this.hostName} envia un paquete de FIN ACK a ${dstHost.hostName}`);
        this.flag = 'FIN-ACK';
        dstHost.flagDst = this.flag;
        this.printSegment(this.flag, this.ack, this.seq, 0)
        let time = new Date()
        this.srcTimer = time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()+':'+ time.getMilliseconds()
        let calRTT = this.calculateRTT()
        this.calculateTcpRetransmision();
        simulation.push({date: this.RTO + ' ms', host: this.hostName, flag:this.flag, seq:this.seq, ack:this.ack + 1, bytes:0})
        //console.log(simulation);
    }

    sendCloseConnection(dstHost, simulation){
        console.log(`${this.hostName} envia un paquete de ACK a ${dstHost.hostName}. Close coneection`);
        this.flag = 'ACK';
        dstHost.flagDst = this.flag;
        this.printSegment(this.flag, this.ack, this.seq, 0)
        let time = new Date()
        this.srcTimer = time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()+':'+ time.getMilliseconds()
        simulation.push({date: '-', host: this.hostName, flag:this.flag, seq:this.seq, ack:this.ack + 1, bytes:0})
        //console.log(simulation);
    }

    printSegment(flag, ack, seq, bytes){
        console.log(`_____________________________________________________
|Flags: ${flag}| seq: ${seq} | ack: ${ack} | bytes: ${bytes} |
¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯`);
    }
}
