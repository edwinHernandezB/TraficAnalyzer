<template>
<v-container fluid>
  <v-app-bar  app clipped-left elevation="0"  class="vAppBar" height="40" >
    <v-app-bar-title>Encontrar dispositivos connectados en la red</v-app-bar-title>
  </v-app-bar>
    <v-row class="ml-1">
      <!-- Select option -->
      <v-col cols="12" md="4">
        <v-select style="margin-top:20px;" 
          :items="accions" label="Elige una opción"
          solo v-model="activeAction" color="info">
        </v-select>
      </v-col>
    </v-row>
    <!-- Alert Info-->
    <v-alert text v-if="hideInfoAlert" color="info" class="mt-2  ml-3">
      <h4> Información sobre esta funcionalidad </h4>

      <div>
        Se utiliza la utilidad de Linux de <strong>ping</strong> para hacer un sondeo a todo el rango de IP's de la red o al rango especificado por el
        usuario, de esta manera al recibir respuesta encontramos los diversos dispositivos conectados en la red en ese momento, además la utilidad de
        <strong>nslookup</strong>  nos permite conocer el nombre del dispositivo asociado a esa IP y <strong>ARP (Address Resolution Protocol)</strong>
        para encontrar la dirección fisíca (MAC) asociada a esta.
            
      </div>
      <v-btn class="mt-1" color="info"  @click="hideInfoAlert = !hideInfoAlert" outlined>Aceptar</v-btn>
    </v-alert>
    <v-form >
      <v-container fluid v-if="activeAction != ''">
        <!--Form de IP-->
        <v-row v-if="activeAction != ''">
          <v-col  cols="12" md="3">
            <v-text-field v-model="IP" :rules="activeAction == accions[0] ? rulesIPNetwork: rulesIP" 
             :label="activeAction == accions[0] ? 'IP de red (p.e: 192.168.1.0)':'Escanear desde (p.e: 192.168.1.50)'" required></v-text-field>
          </v-col>
           <v-col v-if="activeAction != ''" cols="12" md="3">
            <v-text-field v-model="mask" :rules="activeAction == accions[0] ? rulesMask: rulesIPFinal" 
            type="number"
            :label="activeAction == accions[0] ? 'Máscara (p.e entero del 24 hasta 32)':'Escanear hasta (p.e: 192.168.1.100)'" required>
            </v-text-field>
          </v-col>
            <v-btn v-if="activeAction == accions[0]" color="success" class="mt-6 ml-5 " :disabled="!isCorrectIPNetwork" @click="ejecutarScanCompleto"> Ejecutar </v-btn>  
            <v-btn v-if="activeAction == accions[1]" color="success" class="mt-6 ml-5 " :disabled="!isCorrectIP" @click="ejecutarScanCompleto"> Ejecutar </v-btn>  
          </v-row>
          <!-- Table -->   
      <v-card >
        <v-card-title>
          Dispositivos encontrados 
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
      
      </v-container>
    </v-form>

</v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Prueba',
  components: {
    
  },
  data() {
    return {
      accions: ['Escanear la red', 'Escanear red solo a partir de un rango IP'],
      activeAction: '',
      IP: '192.168.1.0',
      mask: 0,
      errorData: false,
      hideInfoAlert: true,
      //---------- Table ---------------
       search: '',
       headers: [
      {
        text: 'IP',
        align: 'start',
        sortable: false,
        value: 'ip',
       },
       { text: 'Domain', value: 'domain' },
       { text: 'Dirección MAC', value: 'mac' },

      ],
      desserts: [],
      
       //----------- Rules form --------------
      //-------------- Option Scan network ----------------
      isCorrectIPNetwork: false,
      isCorrectIP: false,
      rulesIPNetwork:[
         v => !!v || 'IP de red es requerida',
         v => /^(?:[0-9]{1,3}\.){3}[0]{1}$/.test(v) || 'Formato de IP incorrecta',
         v => { if(/^(?:[0-9]{1,3}\.){3}[0]{1}$/.test(v)){ this.isCorrectIPNetwork = true}else { this.isCorrectIPNetwork = false} return true }
      ],
        rulesMask: [
        v => {if(v < 24){this.mask = 24} return true},
        v => {if(v > 32){this.mask = 32} return true},
      ],
      //-------------- Option Scan range of the network ----------------
      rulesIP:[
         v => !!v || 'IP es requerida',
         v => /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(v) || 'Formato de IP incorrecto',
         v => { if(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(v)){ this.isCorrectIP = true}else { this.isCorrectIP = false} return true }
      ],
      rulesIPFinal:[
        v => !!v || 'IP es requerida',
        v => {if(v < 1){this.mask= 1} return true},
        v => {if(v > 256){this.mask = 256} return true},
      ],
    }
  },
  methods: {
    ejecutarScanCompleto: function(){
        let params = { ip: this.IP, 
                      range: this.activeAction == this.accions[0] ? 2**(32 - this.mask):this.mask}
        this.desserts = []
        axios
        .get('http://localhost:4000/scanCompleteNetwork', { params })
        .then(response =>{
          console.log(response.data[0].IP);
          for (let index = 0; index < response.data.length; index++) {
            this.desserts.push({
              ip: response.data[index].IP,
              domain: response.data[index].domain,
              mac: response.data[index].mac
            })  
          }
          
        })
    },
    ejecutarScanParcial: function(){

    }
  },
  watch:{
    activeAction: function(){
      this.IP = ''
    }
  }
}

</script>

<style scoped>
.vAppBar{
  position:fixed; 
  top:40px;
}
</style>