<template>
  <v-app>
    <AppBar></AppBar>


    <v-main style="padding: 15px 0px 0px 56px;">

      <router-view></router-view>
          
    </v-main>
  </v-app>
</template>

<script>
import AppBar from './components/AppBar.vue'
import Home from './views/Home.vue'
//    <Home></Home>

export default {
  name: 'App',

  components: {
    AppBar,
    Home
  },

  data: () => ({
  }),
};
</script>

<style >
.vAppBar{
  position:fixed; 
  top:40px;
}
</style>
