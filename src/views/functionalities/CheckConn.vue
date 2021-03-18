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
          <v-text-field v-model="IP" :rules="rulesIP" :counter="15" label="IP de host a comprobar" required></v-text-field>
        </v-col>

        <v-col cols="12" md="2">
          <v-text-field type="number" v-model="totalPackage" :rules="packageRules" label="nº paquetes" required ></v-text-field>
        </v-col>
      
        <!--Button Ejecutar y Finalizar-->
        <v-btn color="success" class="mt-6 ml-5 " @click="ejecutar"> Ejecutar </v-btn>
        <v-btn color="error" class="mt-6 ml-5" > Finalizar </v-btn>
      
      </v-row>
      
    </v-container>
  </v-form>

      <!-- Alert -->
      <v-alert text color="info">
        <h4> Información sobre esta funcionalidad </h4>
        
        <div>
          Se utiliza la utilidad de <strong>Ping</strong> para detectar si una máquina esta disponible o no a partir de envio de paquetes ICMP.
          Si no se indica un número de paquetes a enviar, por defecto se enviaran 10 paquetes.
        </div>
      </v-alert>
      {{value}}
  </v-container>
</template>

<script>
// @ is an alias to /src
import { exec, spawn } from 'child_process';
export default {
  name: 'CheckConn',
  data() {
    return {
      value: '',
      IP: '',
      totalPackage: '',
      rulesIP:[
         v => !!v || 'IP es requerida',
      ],
      packageRules: [
        v => v > 0 || 'El mínimo debe ser 1 paquete'
      ],
    }
  },
  methods: {
    ejecutar: function(){
      console.log('hola');
     const ls = spawn('echo', ['spawn', 'success!']);

        ls.stdout.on('data', (data) => {
          console.log(`SPAWN: stdout: ${data}`);
          this.result = data;
        });

        ls.stderr.on('data', (data) => {
          console.log(`SPAWN: stderr: ${data}`);
        });

        ls.on('close', (code) => {
          console.log(`SPAWN: child process exited with code ${code}`);
        });
    }
  },
  components: {
    
  }
}//^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$ --> match IPs

</script>

<style scoped>
.vAppBar{
  position:fixed; 
  top:40px;
}


</style>