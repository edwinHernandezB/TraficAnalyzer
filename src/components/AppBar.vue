<template>
<v-container>
    <v-app-bar app clipped-left >
     
     
        <v-img
        src="../assets/TraficAnalyzer_izq_logo.png"
        max-height="200"
        max-width="200"
        ></v-img>
        
        <v-spacer></v-spacer>

        <v-btn icon @click="gitRepository">
            <v-icon dark large>mdi-github</v-icon>
        </v-btn>
        
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