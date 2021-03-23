<template>
<v-container fluid>
 
  <v-app-bar  app clipped-left elevation="0" class="vAppBar" height="40" >
    <v-app-bar-title>Ver Sockets activos</v-app-bar-title>
  </v-app-bar>
  <v-container fluid>
          <v-row>
 <v-col cols="12" md="2">
 <v-select style="margin-top:20px;"
    :items="accions"
    label="Elige una opción"
    solo
  ></v-select>
 </v-col>

   <v-col cols="12" md="1">
  <v-btn color="success" class="mt-6 ml-5 " @click="ejecutar"> Ejecutar </v-btn>
   </v-col>

  <v-col cols="12" md="1">
    <v-btn color="error" class="mt-6 ml-5 " @click="finalizarProceso"> Finalizar proceso </v-btn>
   </v-col>
</v-row>

</v-container >
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
      <v-switch
        v-model="singleSelect"
        label="Seleccionar todo"
        class="pa-3"
      ></v-switch>
    </template>
  </v-data-table>


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
      accions: ['Mostrar todas las conexiones', 'Mostrar solo las conexiones activas', 'Mostrar solo conexiones TCP activas', 'Mostrar solo conexiones UDP activas'],
      activeSockets: '',
      res: '',
      table: []
    }
  },
  methods: {
    ejecutar: function(){
       axios
      .get('http://localhost:4000/activeSockets')
      .then(response =>{

        this.activeSockets = response.data.toString()
        this.res = this.activeSockets.split('\n').map(value => value.match(/[^ |\/]+/g))
        this.res = this.res.splice(2, this.res.length)
        for (let index = 0; index < this.res.length-1; index++) {

          if(this.res[index][0].match('udp')) { 
          
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
          console.log('Ok');
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
