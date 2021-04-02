<template>
<v-container fluid>
 <v-app-bar app clipped-left elevation="0" class="vAppBar" height="40" >
    <v-app-bar-title>Ruta de paquete</v-app-bar-title>
  </v-app-bar>
   <v-row>
        <!-- Select option -->
        <v-col cols="12" md="4">
          <v-select style="margin-top:20px;" 
            :items="accions" label="Elige una opción"
            solo v-model="activeAction" color="info">
          </v-select>
        </v-col>
        
      </v-row>


<v-form >
    <v-container fluid v-if="activeAction != ''">
   
      <v-row v-if="activeAction != accions[3]">
        
        <v-col  cols="12" md="2">
          <v-text-field v-model="IP" :rules="rulesIP"  label="IP de host" required></v-text-field>
        </v-col>
  
        <!--Button Ejecutar y Finalizar-->
        <v-btn color="success" class="mt-6 ml-5 " :disabled="!isCorrectIP" @click="ejecutar"> Ejecutar </v-btn>
        
       
      </v-row>
       <v-row v-if="activeAction == accions[3]" >
        <v-col cols="12" md="2">
          <v-text-field v-model="domain" :rules="rulesDomain" label="Nombre de dominio" required></v-text-field>
        </v-col>
        <!--Button Ejecutar y Finalizar-->
        <v-btn color="success"  class="mt-6 ml-5 " :disabled="domain.length < 1" @click="ejecutar"> Ejecutar </v-btn>
      </v-row>
    <v-alert v-if="auxAction == domain" class="mt-1"
      border="left"
      color="light-blue lighten-2"
      dark
    >
    <v-row class="ml-1">
      <h4>Dominio: {{domain}}</h4>
    </v-row>
     <v-row class="ml-1">
      <h4>IP: {{result}}</h4>
    </v-row>
    </v-alert>

    </v-container>
  </v-form>


</v-container>
</template>

<script>

import axios from 'axios'

export default {
  name: 'PacketPath',
  components: {
    
  },
  data() {
    return {
      accions: ['Trazar ruta de un paquete', 'Mostrar geolocalización de una IP', 
      'Resolver nombre de dominio de una IP', 'Encontrar IP de un nombre de dominio'],
      activeAction: '',
      auxAction: '',
      IP: '',
      domain: ' ',
      result: '',
      showResult: false,
      //----------- Rules form --------------
      isCorrectIP: false,
      rulesIP:[
         v => !!v || 'IP es requerida',
         v => /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(v) || 'Formato de IP incorrecto',
         v => { if(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(v)){ this.isCorrectIP = true}else { this.isCorrectIP = false} return true }
      ],
      rulesDomain: [
        v => !!v || 'Dominio es requerido',
      ],
    }
  },
  methods: {
    ejecutar: function(){
      let selectedOption = this.accions.indexOf(this.activeAction)
      let params = { value: this.activeAction == this.accions[3] ? this.domain: this.IP, 
                     option: selectedOption}
      axios
      .get('http://localhost:4000/packetPath', { params })
      .then(response =>{
        switch (selectedOption) {
          case 3:
            this.auxAction = this.domain
            this.result = response.data
            break;
        
          default:
            break;
        }
        console.log(response.data);
      })

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