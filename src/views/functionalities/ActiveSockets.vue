<template>
<v-container fluid>
  <v-app-bar  app clipped-left elevation="0" class="vAppBar" height="40" >
    <v-app-bar-title>Ver Sockets activos</v-app-bar-title>
  </v-app-bar>

  <v-btn color="success" class="mt-6 ml-5 " @click="ejecutar"> Ejecutar </v-btn>
  {{activeSockets}}
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
      activeSockets: '',
    }
  },
  methods: {
    ejecutar: function(){
       axios
      .get('http://localhost:4000/activeSockets')
      .then(response =>{
        console.log(response.data);
        this.activeSockets = response.data.toString()
        var res = this.activeSockets.split('\n')
        console.log(res);
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
