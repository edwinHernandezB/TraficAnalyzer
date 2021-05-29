<template>
<v-container fluid>
  <v-app-bar  app clipped-left elevation="0" class="vAppBar" height="40" >
    <h4>Simulación TCP</h4>
  </v-app-bar>
  <v-container  class="mt-5">
    <v-row>
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
      
      //Host A
      hostAMss: 0,
      hostAWindow: 0,
      hostABytesTotales: 0,
      //Host B
      hostBMss: 0, 
      hostBWindow: 0, 
      hostBBytesTotales: 0,

      tasaPerdida: 0,

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
   
    lossPacket: function(HostA, HostB, simulation, lossRate){  
      console.log('sdsadsadsad' + lossRate)    
      if (Math.random() <= lossRate) {
          HostA.sendLossDataSegment(HostB, simulation) 
          this.lossPacket(HostA, HostB, simulation, lossRate)
      }else{
          HostB.sendAckSegment(HostA, simulation)
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
    
        let HostA = new TCPSettings(Math.floor(Math.random() * 101), parseInt(this.hostAMss), parseInt(this.hostAWindow), parseInt(this.hostABytesTotales), 'Host A') //seq, mss, window, totalBytes
        let HostB = new TCPSettings(Math.floor(Math.random() * 101), parseInt(this.hostBMss), parseInt(this.hostBWindow), parseInt(this.hostBBytesTotales), 'Host B')//seq, mss, window, totalBytes

        //TCP conection
        HostA.sendSynSegment(HostB, this.simulation);
        HostB.sendSynAck(HostA, this.simulation);
        HostA.sendAck(HostB, this.simulation);


        let timer = async ()=>{
        
          if (HostA.totalBytes == 0) {
              HostA.connectionEnded = true;
              HostB.connectionEnded = true;
          }else{
              HostA.sendDataSegment(HostB, this.simulation)
              this.lossPacket(HostA, HostB, this.simulation, this.tasaPerdida)
          }
          !HostA.connectionEnded && !HostB.connectionEnded ? timer():finish()
      }

        let finish = ()=>{
            HostA.sendFinSegment(HostB, this.simulation)
            HostB.sendFinAckSegment(HostA, this.simulation)
            HostA.sendCloseConnection(HostB, this.simulation)
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
            this.table.push({num: index, host: simulation[index].host, flag: simulation[index].flag, seq: simulation[index].seq,
            ack: simulation[index].ack, bytes: simulation[index].bytes })
            index++;
            index < simulation.length ? setTimeout(()=>timer2(simulation, index), 1000) : 0
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