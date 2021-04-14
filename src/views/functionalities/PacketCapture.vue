<template>
<v-container fluid>
  <v-app-bar  app clipped-left elevation="0" class="vAppBar" height="40" >
    <h4>Capturar paquetes</h4>
  </v-app-bar>
  <!--Formulario-->
  <v-form >
    <v-container fluid>
   
      <v-row>
        <v-col cols="12" md="4">
        <v-select style="margin-top:20px;" 
          :items="accions" label="Elige una opción"
          solo v-model="activeAction" color="info">
        </v-select>
      </v-col>        
        <v-col cols="12" md="2">
          <v-text-field class="mt-4" type="number" v-model="nPackets" :rules="packetsRules" label="nº paquetes" required ></v-text-field>
        </v-col>
      
        <!--Button Ejecutar -->
        <v-btn color="success" class="mt-9 ml-5 " :disabled="this.activeAction == ''" @click="ejecutar"> Ejecutar </v-btn>
       <!-- Alert Info-->
    <v-alert text v-if="hideInfoAlert" color="info" class="mt-2  ml-3">
      <h4> Información sobre esta funcionalidad </h4>

      <div>
        Se utiliza el programa <strong>tcpdump</strong> para capturar el tráfico de la red, pudiendo capturar paquetes de diferentes tipos, estos
        paquetes se muestran en una tabla visualmente mejor que en consola como suele trabajar tcpdump.
            
      </div>
      <v-btn class="mt-1" color="info"  @click="hideInfoAlert = !hideInfoAlert" outlined>Aceptar</v-btn>
    </v-alert>

      </v-row>
      
    </v-container>
  </v-form>

  
      <!-- Table -->     
      <v-card class="ml-3">
        <v-card-title>
          Paquetes 
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscador"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="desserts"
          :search="search"
        ></v-data-table>
      </v-card>
    <v-container fluid>
     <strong>Indicaciones</strong> <br>
      <h7>
        [S]  Solicitud de establecimiento de sesión. <br>
        [S.] Paquete Syn-ACK <br>
        [.] Ningún flag, generalmente utilizado para ACK.<br>
        [F]  Indicación de haber terminado de enviar datos. <br>
        [R]  Interrupción inmediata de la conexión. <br>
        [A]  Confirmar paquete, reconocer los datos del remitente.  <br>
        [P]  Push, envío inmediato de datos al remitente. <br>
      </h7>
    </v-container>
       
</v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'PacketCapture',
  components: {
    
  },
  data() {
    return {
      accions: ['Capturar paquetes TCP', 
      'Capturar paquetes UDP', 'Capturar paquetes ICMP'],
      activeAction: '',
      nPackets: '10',
      //------------- Package table ------------------
      search: '',
      headers: [],
      desserts: [],   
      hideInfoAlert: true,
      //----------Form Rules------------------
      packetsRules: [
        v => {if(v < 1){this.nPackets = 1} return true},
      ],    
    }
  },
  methods:{
    ejecutar: function(){
      let option = this.accions.indexOf(this.activeAction)
      let params = { nPackets: this.nPackets, typeOfPacket:  option}
      this.desserts = []
      this.headers = []
      axios
      .get('http://localhost:4000/capturePackage', { params })
      .then(response =>{
          console.log(response.data);
          
          let res = response.data.split('\n').map(value => value.match(/[^ ]+/g))
          console.log(res[1]);
          switch (option) {
            case 0:
              this.processTCPPackets(res)
              break;
            case 1:
              this.processUDPPackets(res)
              break;
            case 2:
              this.processICMPackets(res)
              break;
            default:
              break;
          }


      })
    },
    processTCPPackets(res){
       this.headers = [
            {
              text: 'IP Origen',
              align: 'start',
              sortable: false,
              value: 'ipOrigen',
            },
            { text: 'Puerto Origen', value: 'portOrigen' },
            { text: 'IP Destino', value: 'ipDst' },
            { text: 'Puerto Destino', value: 'portDst' },
            { text: 'Flags', value: 'flags' },
            { text: 'TOS', value: 'tos' },
            { text: 'TTL' , value: 'ttl' },
            { text: 'ID', value: 'id' },
            { text: 'OffSet', value: 'offset' },
            { text: 'Acknowledgement', value: 'ack' },
            { text: 'Secuencia', value: 'seq' },
            { text: 'Window', value: 'win' },
            { text: 'Payload', value: 'payload' },
            ]
          for (let index = 1; index < res.length; index+=2) {
            let IpOrigen = res[index][0].split('.')
            let IpDst = res[index][2].split('.')
            this.desserts.push({

              ipOrigen: IpOrigen[0] + '.' + IpOrigen[1] + '.' + IpOrigen[2] + '.' + IpOrigen[3],
              portOrigen: IpOrigen[4],
              ipDst: IpDst[0] + '.' + IpDst[1] + '.' + IpDst[2] + '.' + IpDst[3],
              portDst:  IpDst[4].slice(0, IpDst[4].length-1),
              flags: res[index][4].slice(0, res[index][4].length-1),
              tos: res[index-1][3].slice(0, res[index-1][3].length-1),
              ttl: res[index-1][5].slice(0, res[index-1][5].length-1),
              id: res[index-1][7].slice(0, res[index-1][7].length-1),
              offset: res[index-1][9].slice(0, res[index-1][9].length-1),
              ack: res[index].indexOf('ack') != -1 ? res[index][res[index].indexOf('ack')+1].slice(0, res[index][res[index].indexOf('ack')+1].length -1) : '-',
              seq: res[index].indexOf('seq') != -1 ? res[index][res[index].indexOf('seq')+1].slice(0, res[index][res[index].indexOf('seq')+1].length -1) : '-',
              win: res[index].indexOf('win') != -1 ? res[index][res[index].indexOf('win')+1].slice(0, res[index][res[index].indexOf('win')+1].length -1): '-',
              payload: res[index][res[index].length-1]
              
            })
          }
    },
    processUDPPackets(res){
       this.headers = [
            {
              text: 'IP Origen',
              align: 'start',
              sortable: false,
              value: 'ipOrigen',
            },
            { text: 'Puerto Origen', value: 'portOrigen' },
            { text: 'IP Destino', value: 'ipDst' },
            { text: 'Puerto Destino', value: 'portDst' },
            { text: 'Payload', value: 'payload' },
            ]


      for (let index = 0; index < res.length-1; index++) {
        let IpOrigen = res[index][2].split('.')
        let IpDst = res[index][4].split('.')
        
  

        this.desserts.push({

          ipOrigen: IpOrigen[0] + '.' + IpOrigen[1] + '.' + IpOrigen[2] + '.' + IpOrigen[3],
          portOrigen: IpOrigen[4],
          ipDst: IpDst[0] + '.' + IpDst[1] + '.' + IpDst[2] + '.' + IpDst[3],
          portDst:  IpDst[4].slice(0, IpDst[4].length -1),
          payload: res[index][res[index].length-1]
        })
      }

    },
    processICMPackets(res){
      this.headers = [
            {
              text: 'IP Origen',
              align: 'start',
              sortable: false,
              value: 'ipOrigen',
            },
            { text: 'Puerto Origen', value: 'portOrigen' },
            { text: 'IP Destino', value: 'ipDst' },
            { text: 'Puerto Destino', value: 'portDst' },
            { text: 'Paquete', value: 'packetType' },
            { text: 'TOS', value: 'tos' },
            { text: 'TTL' , value: 'ttl' },
            { text: 'ID', value: 'id' },
            { text: 'OffSet', value: 'offset' },
            { text: 'Payload', value: 'payload' },
            ]
      for (let index = 1; index < res.length; index+=2) {
          let IpOrigen = res[index][0].split('.')
          let IpDst = res[index][2].split('.')
          let portOrigen = '-'
          let portDst = '-'
          let packetType = ''

          if (res[index][3] == 'UDP,') {
              portOrigen = IpOrigen[4]
              portDst = IpDst[4].slice(0, IpDst[4].length-1)
              packetType = 'UDP'
          }else {
              if (res[index][4] == 'time') {
                  packetType = 'time exceeded in-transit'
              }else{
                  packetType = res[index][4] +' ' + res[index][5].slice(0, res[index][5].length-1)
              }
          }
          
          this.desserts.push({

          ipOrigen: IpOrigen[0] + '.' + IpOrigen[1] + '.' + IpOrigen[2] + '.' + IpOrigen[3],
          portOrigen: portOrigen,
          ipDst: IpDst[0] + '.' + IpDst[1] + '.' + IpDst[2] + '.' + IpDst[3].slice(0, IpDst[3].length-1),
          portDst:  portDst,
          packetType: packetType,
          tos: res[index-1][res[index-1].indexOf('(tos')+1].slice(0, res[index-1][res[index-1].indexOf('(tos')+1].length-1),
          ttl: res[index-1][res[index-1].indexOf('ttl')+1].slice(0, res[index-1][res[index-1].indexOf('ttl')+1].length-1),
          id: res[index-1][res[index-1].indexOf('id')+1].slice(0, res[index-1][res[index-1].indexOf('id')+1].length-1),
          offset: res[index-1][res[index-1].indexOf('offset')+1].slice(0, res[index-1][res[index-1].indexOf('offset')+1].length-1),
          payload: res[index][res[index].length-1]
          })
         
      }
    },
  }
}
</script>

<style scoped>
.vAppBar{
  position:fixed; 
  top:40px;
}
</style>
