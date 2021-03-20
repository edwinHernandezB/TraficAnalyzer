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
        <v-btn color="error" class="mt-6 ml-5" > Finalizar </v-btn>
      
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
  </v-container>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'

export default {
  
  name: 'CheckConn',
  data() {
    return {
      isCorrectIP: false,
      isCorrectCount: false,
      IP: '127.0.0.1',
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
       axios
      .get('http://localhost:4000/ping?ip=' + this.IP + '&' + 'count=' + this.totalPackage)
      .then(response => {
        var str = ''
         str += response.data.toString();
         /*str = str.split('\n')
         console.log(str);*/
         if(str.includes('Error has ocurred'))
         {
           console.log('error en ejecutar comando');
         }else{
           var lines = str.split("\n");
           console.log(lines);
         }
        // Flush out line by line.
        /*var lines = str.split("\n");
        for(var i in lines) {
            if(i == lines.length - 1) {
                str = lines[i];
            } else{
                // Note: The double-newline is *required*
                this.value += lines[i] + "\n\n";
            }
        }*/
    })
    }
  },
  components: {
    
  },
 
}//^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$ --> match IPs

</script>

<style scoped>
.vAppBar{
  position:fixed; 
  top:40px;
}


</style>