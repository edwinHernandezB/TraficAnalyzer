<template>
<v-container fluid>
  <v-app-bar  app clipped-left elevation="0" class="vAppBar" height="40" >
    <h4>Simulación TCP</h4>
  </v-app-bar>
  <v-container fluid class="mt-5">
    
    <v-row>
      <!-- Alert Info--->
    <v-alert text v-if="hideInfoAlert" color="info" class="mt-2  ml-3">
      <h4> Información sobre esta funcionalidad </h4>

      <div>
        La simulación TCP tiene como objetivo simular situaciones prácticas de envio y recepción de segmentos TCP, el formato en el cual es mostrado 
        es similar al que se ha impartido en clases, con los campos respectivos que se pueden modificar por parte del usuario para ver cómo pueden
        afectar en la transmisión de los segmentos.
        <br>
        <br>
        La simulación utiliza un <strong>algoritmo de retransmisión adaptativo</strong>  que calcula el RTT a partir de las formulas indicadas en el
        <a href="https://datatracker.ietf.org/doc/html/rfc6298" target="_blank"><u><strong>RFC6298</strong></u></a>, junto con la politica del 
        <strong>backoff del timeout.</strong>
        <br><br>
      
        La simulación contiene los siguientes campmos
        <ul>
          <li><strong>Tamaño máximo de segmento (MSS): </strong> Determina la cantidad de bytes que se pueden enviar en el cuerpo del segmento.</li>
          <li><strong>Ventana: </strong> Controla la cantidad de bytes que aún están libres en el buffer de recepción del host destino, evitando sobrecargarlo de
          trabajo a la hora de procesar los datos.</li>
          <li><strong>Nº Bytes a enviar: </strong> Total de bytes a enviar al host destino.</li>
          <li><strong>Rount Trip Time (RTT): </strong>  Tiempo que tarda un paquete en ir y volver al origen habiendo pasado por el destino. </li>
        </ul>
            
      </div>
      <v-btn class="mt-1" color="info"  @click="hideInfoAlert = !hideInfoAlert" outlined>Aceptar</v-btn>
    </v-alert>

      <v-col>
   <v-row cols="12" >
          <v-text-field dense type="number" v-model="hostAMss" :rules="rulesHostA"  label="Maximum Size Segment (MSS)" required></v-text-field>
        </v-row>
          <v-row cols="12">
          <v-text-field dense type="number"  v-model="hostAWindow" :rules="rulesHostA"  label="Tamaño de la ventana" required></v-text-field>
        </v-row>
        <v-row cols="12">
          <v-text-field dense type="number" v-model="hostABytesTotales" :rules="rulesHostA" label="nº bytes totales a enviar" required ></v-text-field>
        </v-row> 
         <v-row cols="12">
          <v-text-field dense type="number"  v-model="rttA" :rules="rulesHostA"  label="Max Round Trip Time" required></v-text-field>
        </v-row>
      </v-col>  
      <v-col>
    <v-img  :src="require('./static/monitorT.png')"   max-height="400"
           max-width="400" ></v-img>
      </v-col>
      <v-col>
   <v-row cols="12" >
          <v-text-field dense type="number" v-model="hostBMss" :rules="rulesHostB"  label="Maximum Size Segment (MSS)" required></v-text-field>
        </v-row>
          <v-row cols="12">
          <v-text-field dense type="number" v-model="hostBWindow" :rules="rulesHostB"  label="Tamaño de la ventana" required></v-text-field>
        </v-row>
       <v-row cols="12">
          <v-text-field dense type="number" v-model="hostBBytesTotales" :rules="rulesHostB" label="nº bytes totales a enviar" required ></v-text-field>
        </v-row>  
        <v-row cols="12">
          <v-text-field dense type="number"  v-model="rttB" :rules="rulesHostA"  label="Max Round Trip Time (ms)" required></v-text-field>
        </v-row>
      </v-col>  
       
    </v-row>
     <v-col md="2">
                <v-text-field dense type="number" v-model="tasaPerdida" :rules="rulesLossRate" label="Tasa de perdida (%)" required ></v-text-field>
    </v-col>
  </v-container>

  <v-container fluid>
      <v-btn :color="startColor" class="mb-2 mr-2" @click="startsimulation">{{startSimulation}}</v-btn>
      <v-btn :color="pauseColor" class="mb-2 mr-2" @click="isPauseSimulation = !isPauseSimulation">{{pauseSimulation}}</v-btn>
      <v-data-table
        v-model="selected" :headers="headers" :items="table" :single-select="singleSelect"
        item-key="id" show-select class="elevation-1">    
      </v-data-table>
  </v-container>
  
</v-container>
</template>

<script>
// @ is an alias to /src
import TCPSettings from "./tcpSimulation"
export default {
  name: 'TCPconcepts',
  data() {
    return {
      rulesHostA:[
        v => {if(v < 0){this.hostAMss = 0} return true},
        v => {if(v < 0){this.hostAWindow = 0} return true},
        v => {if(v < 0){this.hostABytesTotales = 0} return true},
      
      ],
      rulesHostB:[
        v => {if(v < 0){this.hostBMss = 0} return true},
        v => {if(v < 0){this.hostBWindow = 0} return true},
        v => {if(v < 0){this.hostBBytesTotales = 0} return true},
      ],
      rulesLossRate:[
        v => {if(v < 0){this.tasaPerdida = 0} return true},
        v => {if(v > 1){this.tasaPerdida = 1} return true},
      ],
      
      hideInfoAlert: true,
      //Host A
      hostAMss: 0,
      hostAWindow: 0,
      hostABytesTotales: 0,
      rttA: 0,
      //Host B
      hostBMss: 0, 
      hostBWindow: 0, 
      hostBBytesTotales: 0,
      rttB: 0,
      tasaPerdida: 0,

      startHostB: false,

      startColor: 'success',
      pauseColor: 'warning',
      simulation: [],
      startSimulation: 'Comenzar',
      isStartSimulation: false,
      pauseSimulation: 'Pausar',
      isPauseSimulation: false,
      singleSelect: false,
      selected: [],
      table: [],          
      headers: [
        {
          text: 'Package',
          align: 'start',
          sortable: false,
          value: 'num',
        },
         { text: 'RTT', value: 'date' },
         { text: 'Host', value: 'host' },
         { text: 'Flags', value: 'flag' },
         { text: 'Sequence', value: 'seq' },
         { text: 'Aknowledgement', value: 'ack' },
         { text: 'Bytes', value: 'bytes' },
      
      ],
    }
  },
  components: {
    
  },
  watch: {
    isPauseSimulation: function() {
      if (this.isPauseSimulation) {
        this.pauseSimulation = 'Reanudar'
        this.pauseColor = 'info'
      }else{
        this.pauseSimulation = 'Pausar'
        this.pauseColor = 'warning'
      }
    },
    isStartSimulation: function(){
      if (!this.isStartSimulation) {
        this.startColor = 'success'
      }else{
        this.startColor = 'error'
      }
    }
  },
  methods: {
    endSimulation(){
        this.startSimulation = 'Comenzar'
        this.startColor = 'success'
    },
    lossPacket: function(HostA, HostB, simulation, lossRate){  
      console.log('sdsadsadsad' + lossRate)    
      if (Math.random() <= lossRate) {
          HostA.sendLossDataSegment(HostB, simulation) 
          HostA.packetLoss = true
          this.lossPacket(HostA, HostB, simulation, lossRate)
        }else{
          HostB.sendAckSegment(HostA, simulation)
      }
    },
    sendBurstSegment: function(HostA, HostB, simulation){
      console.log('ENTRO  sendburst')
      if (HostA.totalBytes != 0) {
          //Si window es mayor al numero de bytes a enviar
          if (HostA.dstWindowCount >= HostA.bytesToSend) {
              console.log('Entro a burst sendDataSegment')
              //HostA.sendDataSegment(HostB, simulation)
              HostA.sendBurstDataSegment(HostB, simulation)
              HostA.dstWindowCount -= HostA.bytesToSend
          }//Si no es mayor, envia el restante de la ventana
          else{
              console.log('Entro a burst else sendataSegmentSlidingWindow')
              HostA.dstWindowCount = HostA.dstWindow
              HostA.sendDataSegment(HostB, simulation)
              HostB.sendAckSegment(HostA, simulation)
          }
          HostA.dstWindowCount >= HostA.bytesToSend ? this.sendBurstSegment(HostA, HostB, simulation): HostB.sendBurstAckSegment(HostA, simulation)

      }else{
          console.log('envio paquetE ACK DESDE SENDBURSt')
          //HostB.sendAckSegment(HostA, simulation)
          HostB.sendBurstAckSegment(HostA, simulation)
          
      }
    },
    startsimulation: function(){
      if(this.isStartSimulation){
        this.startSimulation = 'Comenzar'
        this.isStartSimulation = false
        this.simulation = []
        
      }
      else{
        this.table = []
        this.startSimulation = 'Detener'
        this.isStartSimulation = true
    
        let HostA = new TCPSettings(Math.floor(Math.random() * 101), parseInt(this.hostAMss), parseInt(this.hostAWindow), parseInt(this.hostABytesTotales), 'Host A', parseInt(this.rttA)) //seq, mss, window, totalBytes
        let HostB = new TCPSettings(Math.floor(Math.random() * 101), parseInt(this.hostBMss), parseInt(this.hostBWindow), parseInt(this.hostBBytesTotales), 'Host B', parseInt(this.rttB))//seq, mss, window, totalBytes

        //TCP conection
        if (HostA.totalBytes != 0) {
            HostA.sendSynSegment(HostB, this.simulation);
            HostB.sendSynAck(HostA, this.simulation);
            HostA.sendAck(HostB, this.simulation);  
            HostA.isFirst = true      
        } else {
            HostB.sendSynSegment(HostA, this.simulation);
            HostA.sendSynAck(HostB, this.simulation);
            HostB.sendAck(HostA, this.simulation);
        }

        let timer = async ()=>{
        
          console.log('Bytes restantes de A antes de finalizar: ', HostA.totalBytes)
          console.log('Bytes restantes de B antes de finalizar: ', HostB.totalBytes)
          if (HostA.totalBytes == 0 && HostB.totalBytes == 0) {
              HostA.connectionEnded = true;
              HostB.connectionEnded = true;
          }else{
              if(Math.random() >= 0.5){
                  if (Math.random() >= 0.5) {
                      if (HostA.totalBytes != 0) {                
                          this.sendBurstSegment(HostA, HostB, this.simulation)
                      }    
                  } else {
                      if (HostB.totalBytes != 0) {                
                          this.sendBurstSegment(HostB, HostA, this.simulation)
                      }
                  }
                  
              }else{
                  if (Math.random() >= 0.5) {
                      if (HostA.totalBytes != 0) {                
                          HostA.sendDataSegment(HostB, this.simulation)
                          this.lossPacket(HostA, HostB, this.simulation, this.tasaPerdida)    
                      }
                  }
                  else{
                      if (HostB.totalBytes != 0) {                
                          HostB.sendDataSegment(HostA, this.simulation)
                          this.lossPacket(HostB, HostA, this.simulation, this.tasaPerdida)
                      }
                  }
              }
            
          }
          !HostA.connectionEnded && !HostB.connectionEnded ? timer():finish()
      }

        let finish = ()=>{
          if (HostA.isFirst) {
              HostA.sendFinSegment(HostB, this.simulation)
              HostB.sendFinAckSegment(HostA, this.simulation)
              HostA.sendCloseConnection(HostB, this.simulation)
          } else {
              HostB.sendFinSegment(HostA, this.simulation)
              HostA.sendFinAckSegment(HostB, this.simulation)
              HostB.sendCloseConnection(HostA, this.simulation)
          }
            
        }
        timer()
 



        let index = 0
        let timer2 = (simulation, index)=>{
          if (!this.isStartSimulation) {
            this.pauseSimulation = 'Pausar'
            this.pauseColor = 'warning'
            this.isPauseSimulation = !this.isPauseSimulation
            return
          }
          if (this.isPauseSimulation) {
            setTimeout(()=>timer2(simulation, index), 1000)
          }else{

            console.log(simulation[index])
            this.table.push({num: index, date: simulation[index].date, host: simulation[index].host, flag: simulation[index].flag, seq: simulation[index].seq,
            ack: simulation[index].ack, bytes: simulation[index].bytes })
            index++;
            index < simulation.length ? setTimeout(()=>timer2(simulation, index), 1000) : this.endSimulation()
          }
        }
        timer2(this.simulation, index)
      }
    }
  },
}
</script>

<style scoped>
.vAppBar{
  position:fixed; 
  top:40px;
}
</style>