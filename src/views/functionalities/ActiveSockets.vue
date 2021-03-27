<template>
  <v-container fluid>
  
    <v-app-bar  app clipped-left elevation="0" class="vAppBar" height="40" >
      <v-app-bar-title>Ver Sockets activos</v-app-bar-title>
    </v-app-bar>

    <v-container fluid>
      <v-row>
        <!-- Select option -->
        <v-col cols="12" md="3">
          <v-select style="margin-top:20px;" 
            :items="accions" label="Elige una opción"
            solo v-model="activeAction" color="info">
          </v-select>
        </v-col>
        
        <!-- Button Ejecutar -->  
        <v-col cols="12" md="1">
          <v-btn :disabled="activeAction == ''? true:false" color="success" class="mt-7 mb-3 " 
            @click="ejecutar"> Ejecutar 
          </v-btn>
        </v-col>
      </v-row>

      <!-- Table -->
      <v-data-table
        v-model="selected" :headers="headers" :items="table" :single-select="singleSelect"
        item-key="id" show-select class="elevation-1">    
      </v-data-table>

       
      <!-- Button Finalizar proceso -->
      <v-row cols="12" md="1" class=" mt-5 mb-4 mr-3" >
        <v-spacer></v-spacer>
        <v-btn color="error" :disabled="selected.length == 0? true:false" 
          @click="finalizarProceso"> Finalizar proceso 
        </v-btn>
      </v-row>

      <!-- Estadisticas  -->
      <v-container fluid v-if="showStatistics">
        <v-row>
          
          <!-- Total de conexiones  -->
          <v-col cols="12" md="6">
            <apexchart ref="barChart" type="bar" height="300" :options="chartOptions" :series="series"></apexchart>
           </v-col>

          <!-- Total de conexiones por programa  -->
          <v-col cols="12" md="5">
              <apexchart ref="programStatistics" type="bar" height="350" :options="chartOptionsPerProgram" :series="seriesPerProgram"></apexchart>
          </v-col> 

          <!-- Estados de conexiones -->
          <v-col cols="12" md="3">
          </v-col> 
        </v-row>
        </v-container> 
    

       <!-- Table inforrmation -->
             <v-container fluid v-if="showStatistics"> 
      <v-col cols="12" >
        <v-alert color="teal lighten-1" dark dense icon="mdi-school" prominent>
          A diferencia de las conexiones <strong>TCP</strong>, <strong>UDP</strong> no establece una conexión previa, es por este
          motivo que en la tabla de conexiones anterior no se muestra de manera estricta nada en la columna de <strong>Estado </strong>
          para las conexiones UDP, pero puede tener dos estados cuando la conexión está activa: <br>
          <ul>
            <li><strong>Establecido:</strong> El dispositivo sigue enviando datagramas al mismo destino a través del mismo puerto UDP.</li>
            <li><strong>Cerrado:</strong> La conexión UDP se cierra cuando no hay eventos nuevos a realizar. </li>
          </ul>

          <table >
            <tr>
              <th colspan="2">Diferencias entre TCP y UDP</th>
            </tr>
            <tr>
              <th>TCP</th>
              <th>UDP</th>
            </tr>
            <tr>
            <tr>
              <td> <strong> 20 Bytes</strong> de cabecera</td>
              <td><strong> 8 Bytes</strong> de cabecera</td>
            </tr>
            <tr>
              <td><strong>Establece una conexión previa</strong> entre los dos ordenadores</td>
              <td>Envia datos <strong>sin establecer conexión previa</strong></td>
            </tr>
            <tr>
              <td>Puede <strong>retransmitir</strong> los <strong>paquetes perdidos</strong></td>
              <td><strong>No retransmite</strong> paquetes perdidos</td>
            </tr>
            <tr>
              <td>Orientado a <strong>conexión</strong></td>
              <td>Orientado a la <strong>no conexión</strong></td>
            </tr>
            <tr>
              <td>Lento</td>
              <td>Rápido</td>
            </tr>
            <tr>
              <td>Fiable</td>
              <td>No fiable</td>
            </tr>
            
            </table>
           
           
        </v-alert>
      </v-col>   
      </v-container> 

      </v-container> 

      <!-- Alert information -->
      <v-row cols="12" md="1" class=" mt-5 mb-4 ml-1" >
        <v-alert text color="info" type="info" v-if="hideInfoAlert">
          <h4> Información sobre esta funcionalidad </h4>

          Esta funcionalidad utiliza netstat para mostrar las diferentes conexiones activas en la computadora. <br>
          <ul>
            <li>Selecciona una opción para mostrar los sockets existentes y presiona <strong>ejecutar</strong>. </li>
            <li>Selecciona una o más conexiones de la tabla y presiona <strong> 
                finalizar proceso </strong>para finalizar la conexión.</li>             
          </ul>            
          
          <strong>NOTA: </strong> <br>
          <ul>
            <li>Hay aplicaciones que, al cerrar la conexión, se cierra la aplicación.</li>
            <li>Un programa puede tener abierto multiples conexiones debido a su manera de trabajar. </li>
            <li>Algunas veces, finalizar la conexión principal hará que todas las demás se cierren. </li>
            <li>Hay aplicaciones con conexión persistente por lo que abren de nuevo una conexión automáticamente. </li>
          </ul>
          <v-btn class="float-right mt-1" color="info"  @click="hideInfoAlert = !hideInfoAlert" outlined>Aceptar</v-btn>
        </v-alert>
      </v-row>  
    </v-container>
</template>

<script>
import axios from 'axios'
import VueApexCharts from 'vue-apexcharts'

export default {
  name: 'ActiveSockets',
  components: {
    apexcharts: VueApexCharts,
  },
  data() {
    return {
      showStatistics: false,
      hideInfoAlert: true,
      accions: ['Mostrar todas las conexiones activas', 'Mostrar conexiones en estado "listening"', 
      'Mostrar solo conexiones TCP activas', 'Mostrar solo conexiones UDP activas'],
      netstatOptions: ['tupn', 'tupnl', 'tpn', 'upn'],
      activeAction: '',
      res: '',
      protocolList: {},
      // --------------- Total de conexiones ----------------
       series: [{
            name: 'Número de conexiones',
            data: []
          }],

           chartOptions: {          
            dataLabels: {
              enabled: true
            },
            grid: {
              row: {
                colors: ['#fff', '#f2f2f2']
              }
            },
            title:{
              text: 'Total de conexiones',
              align: 'center'
            },
            xaxis: {
              categories: [],
              tickPlacement: 'on'
            },
            yaxis: {
              title: {
                text: 'Total de conexiones',
              },
            },
            fill: {
              type: 'gradient',
              gradient: {
                shadeIntensity: 0.25, 
                opacityFrom: 0.85,
                opacityTo: 0.85,
              },
            }
          },
      // ------------- Estadisticas por programa -------------
      seriesPerProgram: [{
            data: []
          }],
          chartOptionsPerProgram: {
            chart: {
              type: 'bar',
              height: 350
            },
            title:{
              text: 'Total de conexiones por programa',
              align: 'center'
            },
            plotOptions: {
              bar: {
                borderRadius: 4,
                horizontal: true,
                distributed: true
              }
            },
            dataLabels: {
              enabled: false
            },
            legend: {
              show: false
            },
            xaxis: {
              categories: [],
            }
          },
      statisticsPerProgram: {},
     
      // ------------- data table ------------------
      singleSelect: false,
      selected: [],
      table: [],          
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: false,
          value: 'id',
        },
         { text: 'Protocolo', value: 'Protocolo' },
         { text: 'Recibidos', value: 'Recibidos' },
         { text: 'Enviados', value: 'Enviados' },
         { text: 'IP local : Puerto', value: 'dirLocal' },
         { text: 'IP remota : Puerto', value: 'dirRemota' },
         { text: 'Estado', value: 'Estado' },
         { text: 'PID', value: 'PID' },
         { text: 'Nombre del programa', value: 'Nombre' },
      ],
    }
  },
  methods: {
    ejecutar: function(){
      this.table = []
      this.showStatistics = true
      let indexAccion = this.accions.indexOf(this.activeAction)
      let params = { netstatOptions: this.netstatOptions[indexAccion]}
      this.protocolList = {}
      this.statisticsPerProgram = {}
      axios
      .get('http://localhost:4000/activeSockets', { params })
      .then(response =>{
        let activeSockets = ''
        activeSockets = response.data.toString()
        this.res = activeSockets.split('\n').map(value => value.match(/[^ |\/]+/g))
        this.res = this.res.splice(2, this.res.length)

        
        for (let index = 0; index < this.res.length-1; index++) {

          if(this.res[index][0].match('udp') && indexAccion != 3 && indexAccion != 0) { 
          
            this.table.push({
            id: index, Protocolo: this.res[index][0], Recibidos: this.res[index][1], Enviados: this.res[index][2], dirLocal: this.res[index][3],
            dirRemota: this.res[index][4], Estado: '-', PID: this.res[index][5], Nombre: this.res[index][6]})
            if(this.statisticsPerProgram[this.res[index][6]] == null) { this.statisticsPerProgram[this.res[index][6]] = 1} else { this.statisticsPerProgram[this.res[index][6]] = this.statisticsPerProgram[this.res[index][6]]+1}
   
          }else{
            this.table.push({
            id: index, Protocolo: this.res[index][0], Recibidos: this.res[index][1], Enviados: this.res[index][2], dirLocal: this.res[index][3],
            dirRemota: this.res[index][4], Estado: this.res[index][5], PID: this.res[index][6], Nombre: this.res[index][7]})
            if(this.statisticsPerProgram[this.res[index][7]] == null) { this.statisticsPerProgram[this.res[index][7]] = 1} else { this.statisticsPerProgram[this.res[index][7]] = this.statisticsPerProgram[this.res[index][7]]+1}

          }
          if(this.protocolList[this.res[index][0]] == null) { this.protocolList[this.res[index][0]] = 1} else { this.protocolList[this.res[index][0]] = this.protocolList[this.res[index][0]]+1}

        }
        

        this.series = [{
                      name: 'Número de conexiones',

          data: Object.values(this.protocolList)
        }]
         this.$refs.barChart.updateOptions({ labels: Object.keys(this.protocolList), });
        
        this.seriesPerProgram = [{

          data: Object.values(this.statisticsPerProgram)
        }]
        this.$refs.programStatistics.updateOptions({ labels: Object.keys(this.statisticsPerProgram), });


        this.selected = []
      })
    },
    finalizarProceso: function(){
      let process = []
      for (let index = 0; index < this.selected.length; index++) {
        process.push(this.selected[index].PID);
     
      }
      
      axios
      .get('http://localhost:4000/killProcess', { params: { processPID: process } })
      .then(response =>{
          console.log('Kill process done!');
          this.table = []
          this.ejecutar()
      })
    },
  },
}
</script>

<style scoped>
.vAppBar{
  position:fixed; 
  top:40px;
}
th{
  text-align: center;
}
td{
  text-align: left;
}
td, th {
  padding: 5px;
  border: 1px solid #dddddd;

}

</style>
