<template>
<v-container fluid>
  <v-app-bar  clipped class="vAppBar" height="40" >
    <h4>Información</h4>
  </v-app-bar>
   <v-container fluid> 
      <v-img class="mt-2 mb-2"  style="margin-left: 500px"
                src="../assets/TraficAnalyzer_izq_logo.png"
                max-height="720"
                max-width="400"
                >
          </v-img>
     <v-col>
       <v-row>
         
       </v-row>
       <v-row>
        <h2 class="font-weight-black mb-4" style="margin-left: 250px">Herramienta para el análisis y simulaciones de redes de datos </h2>
       </v-row>
       <v-row>
        <h4 class="font-weight-black mb-4">¿Qué es TraficAnalyzer?</h4>
<p class="font-weight-bold" style="font-size: 18px">Herramienta con interfaz gráfica desarrollada con el objetivo de proporcionar un programa que permite a los estudiantes explorar y 
  reforzar los diferentes conceptos de redes vistos en clase. La herramienta consiste en dos bloques, las funcionalidades <v-icon>mdi-hammer-wrench</v-icon>, que sirven para el análisis del tráfico de la red y, las simulaciones <v-icon>mdi-cube</v-icon>,
  que se utilizan para reforzar de manera práctica aquellos conceptos vistos en clase de problemas.</p>     

       </v-row>

       <br>
       <br>
     </v-col>
     <v-row>
       <v-col>
          <v-img 
                src="../assets/Escola ingenieria.png"
                max-width="180"
                >
          </v-img>
       </v-col>
       <v-col>
          <v-img  class="mt-2"  style="margin-right: 800px"
                src="../assets/logo_deic.png"
                max-width="180"
                >
          </v-img>
       </v-col>
       <v-col>
 
       </v-col>
     </v-row>

   </v-container>
  </v-container>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'About',
  components: {
    
  }
}
</script>

<style scoped>
.vAppBar{
  position:fixed; 
  top:40px;
}
p {
  text-align: justify;
}
</style>
