<template>
<v-container fluid>
  <v-app-bar app clipped-left elevation="0" class="vAppBar" height="40" >
    <v-app-bar-title>Comprobar Estado de una máquina</v-app-bar-title>
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

      <!-- Alert -->
      <v-alert text color="info">
        <h4> Información sobre esta funcionalidad </h4>
        
        <div>
          Se utiliza la utilidad de <strong>Ping</strong> para detectar si una máquina esta disponible o no a partir de envio de paquetes ICMP.
          El número de paquetes máximo a enviar son 10.
        </div>
      </v-alert>

      <!-- Barra de progreso de solicitud -->
      <v-progress-linear :active="!isFinishPing"
            color="info accent-4"
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>

      <!-- Alerta de cancelación de proceso -->
      <v-alert :value="successProcess" type="success"> El host con IP {{this.IP}} está activo y respondiendo correctamente.</v-alert>

      <!-- Alerta de cancelación de proceso -->
      <v-alert :value="alert" type="error"> Proceso cancelado.</v-alert>
      {{rtt}}
  </v-container>
</template>

<script>

import axios from 'axios'


export default {
  name: 'CheckConn',
  data() {
    return {
      isCorrectIP: false,
      isCorrectCount: false,
      buttonFinalize: false,
      isFinishPing: true,
      cancelSource: null,
      successProcess: false,
      alert: false,
      IP: '127.0.0.1',
      rtt: [],
      totalPackage: '',
      rulesIP:[
         v => !!v || 'IP es requerida',
         v => /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(v) || 'Formato de IP incorrecto',
         v => { if(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(v)){ this.isCorrectIP = true}else { this.isCorrectIP = false} return true }
      ],
      packageRules: [
        v => {if(v < 1){this.totalPackage = 1} return true},
        v => {if(v > 10){this.totalPackage = 10} return true},
        v => {if(v <= 10 && v >= 1 ){this.isCorrectCount = true} else{ this.isCorrectCount = false} return true}
      ],
    }
  },
  methods: {
    ejecutar: function(){
      this.cancelSource = axios.CancelToken.source();
      this.buttonFinalize = !this.buttonFinalize
      this.isFinishPing = !this.isFinishPing
       axios
      .get('http://localhost:4000/ping?ip=' + this.IP + '&' + 'count=' + this.totalPackage, {cancelToken: this.cancelSource.token})
      .then(response => {
        var str = ''
        str += response.data.toString();
        if(str.includes('Error has ocurred'))
        {
          console.log('error en ejecutar comando');
        }else{
          //this.cancelSource = null;
          var lines = str.split("\n");
          //console.log('lines: ' + lines);
          //var time = []
          this.rtt = []
          for (let index = 1; index <= this.totalPackage; index++) {
            //time.push(lines[index].split('time=').pop().split(' ')[0]);
            this.rtt.push(lines[index].split('time=').pop().split(' ')[0]);
          
          }
          
          this.isFinishPing = !this.isFinishPing
          this.buttonFinalize = !this.buttonFinalize
          this.successProcess = !this.successProcess
          //console.log('RTT: ' + time);
          console.log('RTT: ' + this.rtt);
          var hideSuccessProcesss = (()=>{
            setTimeout(()=>{
              this.successProcess=false
            },4000)
          })()
        }   
      })
    },
    finalizar: function(){
     // this.$forceUpdate();ç
      if (this.cancelSource) {
        
        this.cancelSource.cancel('Stop active process');
        console.log('cancel request done');
        
        this.isFinishPing = !this.isFinishPing
        this.buttonFinalize = !this.buttonFinalize
        
        this.alert = true
        setTimeout(()=>{
          this.alert=false
        },3000)
      }
    }
  },
  components: {
    
  },
  watch: {
    
  }
 
}

</script>

<style scoped>
.vAppBar{
  position:fixed; 
  top:40px;
}


</style>