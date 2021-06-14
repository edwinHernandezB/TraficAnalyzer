<template>
<v-container fluid>

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
         <v-row>
        <h4 class="font-weight-black mb-4">¿Por qué TraficAnalyzer?</h4>
<p class="font-weight-bold" style="font-size: 18px">A travez del tiempo se han ido desarrollando diversos programas en Linux para el análisis de la red, muchos de estos carecen
  de interfaz gráfica y por ese motivo TraficAnalyzer funciona como interfaz para el uso de las utilidades que Linux proporciona, siendo más fácil para el usuario
  utilizarlas y, además, están integradas desde un solo lugar. Por otro lado, también proporciona las simulaciones que ayudan a reforzar la parte práctica que
  se ha ido viendo durante las clases.</p>        
       </v-row>
         <v-row>
        <h4 class="font-weight-black mb-4">¿Qué es lo siguiente?</h4>
<p class="font-weight-bold" style="font-size: 18px">TraficAnalyzer es un programa escalable ya que ha sido desarrollado con tecnologias que escalan muy bien como lo son Vue, NodeJS y 
  otras dependencias de diseño de componentes, por este motivo el programa puede ser mejorado y rediseñado para que cada una de las funcionalidades puedan llegar a ser más completas o bien, 
  poder añadir nuevas funcionalidades y simulaciones.</p>        
       </v-row>
     </v-col>

   </v-container>
  </v-container>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
    
  }
}
</script>
<style scoped>
p {
  text-align: justify;
}
</style>