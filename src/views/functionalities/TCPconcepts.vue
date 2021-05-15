<template>
<v-container fluid>
  <v-app-bar  app clipped-left elevation="0" class="vAppBar" height="40" >
    <h4>Conceptos de TCP</h4>
  </v-app-bar>
  <v-container>
    <v-img src="src\static\monitorT.png" aspect-ratio="1.7"></v-img>
  </v-container>
  <v-container>
      <v-btn @click="startsimulation">{{startSimulation}}</v-btn>
      <v-btn @click="isPauseSimulation = !isPauseSimulation">{{pauseSimulation}}</v-btn>
      <v-data-table
        v-model="selected" :headers="headers" :items="table" :single-select="singleSelect"
        item-key="id" show-select class="elevation-1">    
      </v-data-table>
  </v-container>
</v-container>
</template>

<script>
// @ is an alias to /src
import TCPSettings from '/Ing. Informática 4to Curso/2n Semestre/TFG/TraficAnalyzer/TraficAnalyzer/public/tcpSimulation'
export default {
  name: 'TCPconcepts',
  data() {
    return {
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
      }else{
        this.pauseSimulation = 'Pausar'
      }
    }
  },
  methods: {
    startsimulation: function(){
      if(this.isStartSimulation){
        this.startSimulation = 'Comenzar'
        this.isStartSimulation = false
      }
      else{
        this.startSimulation = 'Detener'
        this.isStartSimulation = true
        let HostA = new TCPSettings(3, 4, 10, 11, 'HostA') //seq, mss, window, totalBytes

        let HostB = new TCPSettings(100, 2, 8, 20, 'HostB')//seq, mss, window, totalBytes

        //TCP conection
        HostA.sendSynSegment(HostB, this.simulation);
        HostB.sendSynAck(HostA, this.simulation);
        HostA.sendAck(HostB, this.simulation);


        let timer = async ()=>{
            HostA.sendDataSegment(HostB, this.simulation)
            HostB.sendAckSegment(HostA, this.simulation)
            if (HostA.totalBytes == 0) {
                HostA.connectionEnded = true;
                HostB.connectionEnded = true;
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