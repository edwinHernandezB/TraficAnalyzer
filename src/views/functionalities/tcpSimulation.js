
let simulation = []
export default class TCPSettings {

    constructor(seq, mss, window, totalBytes, hostName){
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
        //Destination
        this.dstSeq = 0;
        this.dstMSS = 0;
        this.dstWindow = 0;
        this.flagDst = '-';
        this.totalDstBytes = 0;
        this.dstRmBytes = 0;
    }


    // TCP connection
    sendSynSegment(dstHost, simulation){
        console.log(`${this.hostName} envia a ${dstHost.hostName} paquete SYN:`);
        dstHost.dstWindow = this.window;
        dstHost.dstMSS = this.mss;
        dstHost.bytesToSend = this.mss; 
        dstHost.dstSeq = this.seq;
        dstHost.flagDst = this.flag;
        dstHost.printSegment(this.flag, this.ack, this.seq, 0)
        simulation.push({host: this.hostName, flag:this.flag, seq:this.seq, ack:this.ack, bytes:0})
        //console.log(simulation);
    }

    sendSynAck(dstHost, simulation){
        console.log(`${this.hostName} envia a ${dstHost.hostName} paquete SYN-ACK:`);
        dstHost.dstWindow = this.window;
        dstHost.dstMSS = this.mss;
        dstHost.bytesToSend = this.mss; 
        dstHost.dstSeq = this.seq;
        dstHost.flagDst = 'SYN-ACK';
        this.ack = this.dstSeq + 1;
        dstHost.printSegment(dstHost.flagDst, this.ack, this.seq, 0)
        simulation.push({host: this.hostName, flag:dstHost.flagDst, seq:this.seq, ack:this.ack, bytes:0})
        //console.log(simulation);

    }

    sendAck(dstHost, simulation){
        console.log(`${this.hostName} envia a ${dstHost.hostName} paquete ACK:`);
        //dstHost.dstWindow = this.window;
        //dstHost.dstMSS = this.mss;
        this.flagDst = 'ACK';
        this.seq += 1;
        this.ack = dstHost.seq + 1;
        dstHost.seq +=1
        dstHost.printSegment(this.flagDst, this.ack, this.seq, 0)
        simulation.push({host: this.hostName, flag:this.flagDst, seq:this.seq, ack:this.ack,  bytes:0})
        console.log(this.dstWindow, dstHost.dstWindow);
    }

    sendDataSegment(dstHost, simulation){
        console.log(`${this.hostName} envia un paquete de datos a ${dstHost.hostName}`);
        //this.bytesToSend = this.dstMSS; //Envío un segmento con el máximo numuero de bytes posibles según el mss destino
        if (this.totalBytes >= this.bytesToSend) {
            this.totalBytes -= this.bytesToSend; // Resto el número de bytes enviados al total de bytes que tengo que enviar
            dstHost.totalDstBytes = this.bytesToSend; //Registro en el host destino los bytes que se envían en el segmento desde origen        
        }else{
            this.bytesToSend = this.totalBytes;
            this.totalBytes -= this.bytesToSend;
            dstHost.totalDstBytes = this.bytesToSend
        }

        dstHost.printSegment(this.flagDst, this.ack, this.seq, this.bytesToSend)
        simulation.push({host: this.hostName, flag:this.flagDst, seq:this.seq, ack:this.ack, bytes:this.bytesToSend})
        this.seq += this.bytesToSend; //Actualizo la secuencia aumentando los bytes enviados

    }
    sendLossDataSegment(dstHost, simulation){
        console.log(`${this.hostName} reenvia un paquete de datos a ${dstHost.hostName}`);
        //this.bytesToSend = this.dstMSS; //Envío un segmento con el máximo numuero de bytes posibles según el mss destino
        dstHost.printSegment(this.flagDst, this.ack, this.seq - this.bytesToSend, this.bytesToSend)
        simulation.push({host: this.hostName, flag:this.flagDst, seq:this.seq - this.bytesToSend, ack:this.ack, bytes:this.bytesToSend})
    }

    sendAckSegment(dstHost, simulation){
        console.log(`${this.hostName} envia un paquete de ACK a ${dstHost.hostName}`);
        //this.bytesToSend = this.dstMSS; //Envío un segmento con el máximo numuero de bytes posibles según el mss destino
        this.flag = 'ACK'
        this.ack += this.totalDstBytes  // Sumo al ack el siguiente byte que quiero esperar
        //this.totalBytes -= this.bytesToSend; // Resto el número de bytes enviados al total de bytes que tengo que enviar
        this.totalBytes -= this.bytesToSend; // Resto el número de bytes enviados al total de bytes que tengo que enviar
        dstHost.totalDstBytes = this.bytesToSend; //Registro en el host destino los bytes que se envían en el segmento desde origen
        dstHost.printSegment(this.flag, this.ack, this.seq, 0)
        //this.seq += this.bytesToSend;
        //dstHost.dstSeq += this.bytesToSend;
        //dstHost.printSegment(this.flag, this.ack, this.seq, this.bytesToSend)
        simulation.push({host: this.hostName, flag:this.flag, seq:this.seq, ack:this.ack, bytes:0})
        //console.log(simulation);
    }

    sendFinSegment(dstHost, simulation){
        console.log(`${this.hostName} envia un paquete de FIN a ${dstHost.hostName}`);
        this.flag = 'FIN';
        dstHost.flagDst = this.flag;
        this.printSegment(this.flag, this.ack, this.seq, 0)
        simulation.push({host: this.hostName, flag:this.flag, seq:this.seq, ack:this.ack, bytes:0})
        //console.log(simulation);
    }

    sendFinAckSegment(dstHost, simulation){
        console.log(`${this.hostName} envia un paquete de FIN ACK a ${dstHost.hostName}`);
        this.flag = 'FIN-ACK';
        dstHost.flagDst = this.flag;
        this.printSegment(this.flag, this.ack, this.seq, 0)
        simulation.push({host: this.hostName, flag:this.flag, seq:this.seq, ack:this.ack, bytes:0})
        //console.log(simulation);
    }

    sendCloseConnection(dstHost, simulation){
        console.log(`${this.hostName} envia un paquete de ACK a ${dstHost.hostName}. Close coneection`);
        this.flag = 'ACK';
        dstHost.flagDst = this.flag;
        this.printSegment(this.flag, this.ack, this.seq, 0)
        simulation.push({host: this.hostName, flag:this.flag, seq:this.seq, ack:this.ack, bytes:0})
        //console.log(simulation);
    }

    printSegment(flag, ack, seq, bytes){
        console.log(`_____________________________________________________
|Flags: ${flag}| seq: ${seq} | ack: ${ack} | bytes: ${bytes} |
¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯`);
    }
}
