<template>
<v-container fluid>
 
  <v-app-bar  app clipped-left elevation="0" class="vAppBar" height="40" >
    <v-app-bar-title>Ver Sockets activos</v-app-bar-title>
  </v-app-bar>
  <v-container fluid>
          <v-row>
 <v-col cols="12" md="3">
 <v-select style="margin-top:20px;"
    :items="accions"
    label="Elige una opción"
    solo
    v-model="activeAction" 
    color="info"
  ></v-select>
 </v-col>

   <v-col cols="12" md="1">
  <v-btn :disabled="activeAction == ''? true:false" color="success" class="mt-7 mb-3 " @click="ejecutar"> Ejecutar </v-btn>
   </v-col>

  <v-alert text color="info" type="info" class="mt-8 mb-10">
      Selecciona una opción para mostrar los sockets existentes, para finalizar una conexión 
      selecciona una o más opciones de la lista.
    </v-alert>
</v-row>


<!-- data table -->

  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="table"
    :single-select="singleSelect"
    item-key="id"
    show-select
    class="elevation-1"
  >
    <template v-slot:top>
      
    </template>
  </v-data-table>
  <v-spacer></v-spacer>
    <v-btn color="error" :disabled="selected.length == 0? true:false" class="mt-6 float-right" @click="finalizarProceso"> Finalizar proceso </v-btn>
    </v-container >
</v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ActiveSockets',
  components: {
    
  },
  data() {
    return {
      // ------------- data table ------------------
      singleSelect: false,
        selected: [],
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
           { text: 'Direccion local', value: 'dirLocal' },
           { text: 'Direccion remota', value: 'dirRemota' },
           { text: 'Estado', value: 'Estado' },
           { text: 'PID', value: 'PID' },
           { text: 'Nombre del programa', value: 'Nombre' },
        ],          
      accions: ['Mostrar todas las conexiones activas', 'Mostrar sockets en estado "listening"', 'Mostrar solo conexiones TCP activas', 'Mostrar solo conexiones UDP activas'],
      netstatOptions: ['tupn', 'tupnl', 'tpn', 'upn'],
      activeAction: '',
      res: '',
      table: []
    }
  },
  methods: {
    ejecutar: function(){
      this.table = []
      let indexAccion = this.accions.indexOf(this.activeAction)
      let params = { netstatOptions: this.netstatOptions[indexAccion]}
       axios
      .get('http://localhost:4000/activeSockets', { params })
      .then(response =>{
        let activeSockets = ''
        activeSockets = response.data.toString()
        this.res = activeSockets.split('\n').map(value => value.match(/[^ |\/]+/g))
        this.res = this.res.splice(2, this.res.length)

        
        for (let index = 0; index < this.res.length-1; index++) {

          if(this.res[index][0].match('udp') && indexAccion != 3) { 
          
            this.table.push({
            id: index, Protocolo: this.res[index][0], Recibidos: this.res[index][1], Enviados: this.res[index][2], dirLocal: this.res[index][3],
            dirRemota: this.res[index][4], Estado: '-', PID: this.res[index][5], Nombre: this.res[index][6]})
                 
          }else{
            this.table.push({
            id: index, Protocolo: this.res[index][0], Recibidos: this.res[index][1], Enviados: this.res[index][2], dirLocal: this.res[index][3],
            dirRemota: this.res[index][4], Estado: this.res[index][5], PID: this.res[index][6], Nombre: this.res[index][7]})
          }
        }
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
</style>
