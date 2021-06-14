<template>
<v-container>
    <v-app-bar app clipped-left elevation="0" height="40">
     
        <router-link to="/">
            <v-img class="vImg"
            src="../assets/TraficAnalyzer_izq_logo.png"
            max-height="200"
            max-width="200"
            ></v-img>
        </router-link>
        
        <v-spacer></v-spacer>

        <v-btn icon @click="gitRepository">
            <v-icon dark large>mdi-github</v-icon>
        </v-btn>
        <v-app-bar  class="vAppBar" elevation="0" height="40">
            <h4>Home</h4>
        </v-app-bar>
    </v-app-bar>
   
    <NavDrawer></NavDrawer>
  
</v-container>
</template>

<script>
import NavDrawer from './NavDrawer.vue'
export default {
    name: 'AppBar',
    components: {
    NavDrawer,
    },
    data() {
        return {
        }
    },
    methods:{
        gitRepository: function(){
           window.open("https://github.com/edwinHernandezB/TraficAnalyzer", "_blank"); 
        }
    }
}
</script>

<style scoped>

.vAppBar{
  position:fixed; 
  top:40px;
}

</style>l