<template>
<v-container >

      <v-img class="mt-2" style="display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;"
                src="../assets/TraficAnalyzer_izq_logo.png"
                max-height="720"
                max-width="400"
                >
          </v-img>
     <v-col>
   
       <v-row>
        <h2 class="font-weight-black mb-2" style="display: block;
  margin-left: auto;
  margin-right: auto;
  ">Herramienta para el análisis y simulaciones de redes de datos </h2>
       </v-row>
       <br>
       <br>
       <br>
       <v-row>
        <h2 class="font-weight-medium"  style=" display: block;
  margin-left: auto;
  margin-right: auto;
  ">Implementado con las tecnologias </h2>
       </v-row>
       <v-row>
       <v-col>
         <v-img  style="display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;"
                src="../assets/tecnologias.png"
                max-width="700"
                >
          </v-img>
       </v-col>
       </v-row>
       <br>
       <br>
         <v-row>
        <h4 class="font-weight-black mb-4">¿Por qué TraficAnalyzer?</h4>
<p class="font-weight-bold" style="font-size: 18px">A travez del tiempo se han ido desarrollando diversos programas en Linux para el análisis de la red, muchos de estos carecen
  de interfaz gráfica y por ese motivo TraficAnalyzer funciona como interfaz para el uso de las utilidades que Linux proporciona, siendo más fácil para el usuario
  utilizarlas y, además, están integradas desde un solo lugar. Por otro lado, estas funcionalidades permiten explorar diferentes conceptos de redes de datos impartidos
  en clase y también proporciona simulaciones que ayudan a reforzar la parte práctica que se ha ido viendo durante estas.</p>        
       </v-row>
         <v-row>
        <h4 class="font-weight-black mb-4">¿Qué es lo siguiente?</h4>
<p class="font-weight-bold" style="font-size: 18px">TraficAnalyzer es un programa escalable ya que ha sido desarrollado con tecnologias que escalan muy bien como lo son Vue, NodeJS y 
  otras dependencias de diseño de componentes, por este motivo el programa puede ser mejorado y rediseñado para que cada una de las funcionalidades y simulaciones puedan llegar a ser más 
  completas, o bien, 
  poder añadir nuevas funcionalidades y simulaciones.</p>        
       </v-row>
     </v-col>

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