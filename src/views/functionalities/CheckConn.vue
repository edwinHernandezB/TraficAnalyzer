<template>
<v-container fluid>
  <v-app-bar app clipped-left elevation="0" class="vAppBar" height="40" >
    <h4>Comprobar Estado de una máquina</h4>
    
  </v-app-bar>
 <!--Formulario-->
  <v-form >
    <v-container fluid>
   
      <v-row>
        
        <!--IP de host a comprobar y Número de paquetes a enviar-->
        <v-col cols="12" md="2">
          <v-text-field v-model="IP" :rules="rulesIP"  label="IP de host" required></v-text-field>
        </v-col>
        
        <v-col cols="12" md="2">
          <v-text-field type="number" v-model="totalPackage" :rules="packageRules" label="nº paquetes" required ></v-text-field>
        </v-col>
      
        <!--Button Ejecutar y Finalizar-->
        <v-btn color="success" class="mt-6 ml-5 " :disabled="!isCorrectIP" @click="ejecutar"> Ejecutar </v-btn>
        <v-btn color="error" class="mt-6 ml-5" :disabled="!buttonFinalize" @click="finalizar" > Finalizar </v-btn>
      
      </v-row>
      
    </v-container>
  </v-form>

      <!-- Alert Info-->
      <v-alert text v-if="hideInfoAlert" color="info" class="mt-2  ml-3">
        <h4> Información sobre esta funcionalidad </h4>
        
        <div>
          Se utiliza la utilidad de <strong>Ping</strong> para detectar si una máquina esta disponible o no a partir de envio de paquetes ICMP.
          El número de paquetes máximo a enviar son 10. <br>
          El resultado <strong>puede tardar unos segundos</strong>  en función del número de paquetes enviados, aproximadamente un segundo por paquete.
        </div>
        <v-btn class="mt-1" color="info"  @click="hideInfoAlert = !hideInfoAlert" outlined>Aceptar</v-btn>

      </v-alert>

      <!-- Barra de progreso de solicitud -->
      <v-progress-linear :active="!isFinishPing"
            color="info accent-4"
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>

      <!-- Alerta de proceso finalizado correctamente -->
      <v-alert :value="successProcess" type="success" class="mt-2"> El host con IP {{this.hostIP}} está activo y respondiendo correctamente.</v-alert>

      <!-- Alerta de cancelación de proceso -->
      <v-alert :value="alert" type="error"  class="mt-2"> Proceso cancelado.</v-alert>

      <!-- Alerta de proceso Inactivo -->
      <v-alert :value="errorPing" type="error"  class="mt-2"> Ha ocurrido un error con el host con IP {{this.hostIP}}. Comprueba si la IP es correcta, si lo es, es posible que el 
        host no este activo. La causa puede ser debido a diferentes problemas, algunos pueden ser:
        <ul>
          <li>El host está apagado.</li>
          <li>No hay conexión a Internet.</li>
          <li>Configuración de firewall por parte del host destino u origen.</li>
          <li>Un host intermedio del camino de entrega utilizado no está activo. En este caso, puedes comprobar con un <b>traceroute</b> para conocer este host </li>
        </ul>
      </v-alert>
      
      <!-- Estadisticas de ping -->
      <v-container fluid v-if="showStatistics">
        <v-row>
          <v-col cols="12" md="4">
            <h3 style="margin-left: 100px;">RTT de paquetes enviados</h3>
            <apexchart ref="rttChart" width="500" type="line" :options="charLineOptions" :series="series"></apexchart>
          </v-col>      

          <v-col cols="12" md="3">
            <apexchart style=" margin-top: 80px;" ref="donutPackage" width="380" type="donut" :options="optionsPackage" :series="seriesPackage"></apexchart>
          </v-col>
        </v-row>

        <v-container fluid>
        <v-row>
        <v-col cols="12" md="2">
          <table >
            <tr>
              <td>
                <th>RTT</th>
                <tr v-for="item in rtt.stats.title" :key="item.id"> {{item}}</tr>
              </td>
                
              <td>
                <th>VALUE</th>
                <tr v-for="item in stats" :key="item.id"> {{item}} ms</tr>
              </td>
            </tr>
          </table>
        </v-col>  
        <!-- Alert Info-->
        <v-col cols="12" md="8">     
             <v-alert text color="info">
          <h4> Sobre el RTT: </h4>
          <div>
            RTT es el tiempo que tarda un paquete en ir y volver al origen habiendo pasado por el destino, 
            este intervalo de tiempo es importante ya que podemos determinar aquella latencia de comunicación
            entre un punto físico y otro. 
            El RTT no solo determina la latencia de distancia sino que también puede deberse a otros factores como 
            tener un tráfico alto en alguna red por donde pasa el paquete, la velocidad de una conexión en un punto, 
            cuello de botella en caso de ser un servidor, etc.
          </div>
        </v-alert>
        </v-col>           
        </v-row>

      
      </v-container>
    </v-container>
        
  </v-container>
</template>

<script>

import axios from 'axios'
import VueApexCharts from 'vue-apexcharts'


export default {
  name: 'CheckConn',
  components: {
    apexcharts: VueApexCharts,
  },
  updated(){
    this.updateChartLineSeries()  
  },
  data() {
    return {
      isCorrectIP: true,
      buttonFinalize: false,
      errorPing: false,
      isFinishPing: true,
      cancelSource: null,
      successProcess: false,
      showStatistics: false,
      hideInfoAlert: true,
      alert: false,
      IP: '127.0.0.1',
      hostIP: '',
      rtt: { rtt:[], stats: {title:['Mínimo', 'Media', 'Máximo', 'Desviación'], value: []} },
      totalPackage: '',

      //----------Form Rules------------------
      rulesIP:[
         v => !!v || 'IP es requerida',
         v => /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(v) || 'Formato de IP incorrecto',
         v => { if(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(v)){ this.isCorrectIP = true}else { this.isCorrectIP = false} return true }
      ],
      packageRules: [
        v => {if(v < 1){this.totalPackage = 1} return true},
        v => {if(v > 10){this.totalPackage = 10} return true},
      ],
      //---------Line Chart RTT---------------
      
      charLineOptions: {
        chart: {
          id: 'packages RTT'
        },
        xaxis: {
          title: {
          text: 'Paquetes',  
        },  
          categories: []
        },

        yaxis: [
        {
          title: {
            text: "Milisegundos"
          },
        },],
      },
      
      series: [{
        name: 'RTT',
        data: []
      }],
      stats : [],
      prueba: [],
      //---------Donut Chart Packages---------------
      optionsPackage: {
        labels: ['Total entregados', 'Total Perdidos']
      },
      seriesPackage: []
    }
  },
  
  methods: {
    ejecutar: function(){
      
        this.cancelSource = axios.CancelToken.source();
        this.changeState()
   /*   let evtSource = new EventSource("http://localhost:4000/ping");

     

      evtSource.onmessage = (e) =>{
          console.log("received event");
          console.log(e);
          this.prueba.push(e.data)
          let str = e.data.toString()
          str = str.split()
         
          console.log(str);
      };      

      evtSource.onerror = function(e) {
          console.log("EventSource failed.");
          console.log(e.data);
      };

      console.log(evtSource);*/
      
      axios
      .get('http://localhost:4000/ping?ip=' + this.IP + '&' + 'count=' + this.totalPackage, {cancelToken: this.cancelSource.token})
      .then(response => {
        let str = ''
        str += response.data.toString();

        if(str.includes('Error has ocurred'))
        {
          this.finalizar()
          this.hostIP = this.IP
          this.errorPing = !this.errorPing
          setTimeout(()=>{ this.errorPing=false },15000)

        }else{
          let lines = str.split("\n");
          this.rtt.rtt = []
          this.rtt.stats.value = []
        
          let totalPackage = str.split('---').pop()
          totalPackage = totalPackage.toString()
          totalPackage = totalPackage.match(/\d+/g).map(Number).slice(0, 2);
          
          let rttStats = str.split('mdev = ').pop().split('/')
          rttStats[rttStats.length-1] = rttStats[rttStats.length-1].slice(0, -4)
          this.stats = rttStats

          this.hostIP = this.IP

          if(totalPackage[0] == totalPackage[1]){ this.seriesPackage = totalPackage.slice(0, 1)} 
          else { this.seriesPackage = totalPackage.slice(0, 2)}

          for (let index = 1; index <= this.totalPackage; index++) {
            this.rtt.rtt.push(lines[index].split('time=').pop().split(' ')[0]);

          }

          this.updateChartLineSeries();
          this.changeState()
          this.successProcess = !this.successProcess

          setTimeout(()=>{ this.successProcess=false },5000)

          if(!this.showStatistics) { this.showStatistics = !this.showStatistics}

        }   
      })
    },
    finalizar: function(){
      if (this.cancelSource) {
        
        this.cancelSource.cancel('Stop active process');
        console.log('cancel request done');
        this.changeState()
        
        this.alert = true
        setTimeout(()=>{ this.alert=false },3000)
      }
    },
    changeState(){
      this.isCorrectIP = !this.isCorrectIP
      this.isFinishPing = !this.isFinishPing
      this.buttonFinalize = !this.buttonFinalize
    },
    updateChartLineSeries(){

      if (this.$refs.rttChart != undefined) {
            this.$refs.rttChart.updateSeries([{
                        name: 'RTT',
                        data: this.rtt.rtt,
          }])
      }
    },
   
  },
}

</script>

<style scoped>
.vAppBar{
  position:fixed; 
  top:40px;
}

td, th, tr {
  border: black 1px solid;
  padding: 1px;
  margin: 20px;
}

</style>