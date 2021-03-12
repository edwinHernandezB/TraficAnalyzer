<template>
<v-container>
    <v-app-bar app 
      >
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
       
          <v-img
    class="mx-2"
    src="../assets/TraficAnalyzer_tr_logo.png"
    max-height="200"
    max-width="200"
    contain
  ></v-img>

    </v-app-bar>
    <NavDrawer :drawerActive="drawer" @clickOutside="onClickOutside"></NavDrawer>
  
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
            drawer: false
        }
    },
    methods:{
        onClickOutside: function(value){
            this.drawer = value
        }
    }
}
</script>