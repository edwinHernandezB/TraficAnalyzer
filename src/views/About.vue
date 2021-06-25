<template>
<v-container fluid>
  <v-app-bar  clipped class="vAppBar" height="40" >
    <h4>Información</h4>
  </v-app-bar>
  <v-container>
      <v-img class="mt-2 mb-2" style="display: block;
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
        <h2 class="font-weight-black mb-4" style="display: block;
  margin-left: auto;
  margin-right: auto;
  " >Herramienta para el análisis y simulaciones de redes de datos </h2>
       </v-row>
       <v-row>
         <p class="font-weight-bold" >Aplicación desarrollada como Trabajo de Fin de Grado (TFG)
perteneciente a los estudios de Ingeniería Informática de la Escola d’Enginyeria y enfocado
en la mención de Tecnologías de la Información (TI) de la Universidad Autónoma de
Barcelona (UAB).</p>
<p class="font-weight-bold" style="display: block;
  margin-left: auto;
  margin-right: auto;
  " > TraficAnalyzer está bajo la LICENCIA PÚBLICA GENERAL DE GNU 
  Versión 3, 29 de junio de 2007 Copyright (C) 2007 Free Software Foundation, Inc. 
  Todo el mundo está autorizado a copiar y distribuir copias literales de este documento de licencia, pero no está permitido modificarlo. 
TraficAnalyzer bajo esta licencia permite las siguientes acciones:

  

</p>  
<v-img class="mt-5" style="display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;" 
                src="../assets/license.png"
                
                max-width="600"
                >
          </v-img>
       </v-row>

       <br>
       <br>
     </v-col>
     <v-card
    class="mx-auto mb-5"
    outlined
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">
          Información de contacto
        </div>
        <v-list-item-title class="headline mb-1">
          Email
        </v-list-item-title>
       <v-list-item-subtitle>  <v-icon large color="blue darken-2"> mdi-email </v-icon>edwinalberto.hernandez@e-campus.uab.cat</v-list-item-subtitle>
        <v-list-item-subtitle>  <v-icon large color="blue darken-2"> mdi-email </v-icon>edwinhb139@gmail.com</v-list-item-subtitle>
        <br>
        <v-list-item-title class="headline mb-1">
          Redes Sociales
        </v-list-item-title>
       
               <v-list-item-subtitle>  <v-icon large color="blue darken-2"> mdi-linkedin</v-icon> <a href="https://www.linkedin.com/in/edwinhernandezb" 
               target="_blank">edwinhernandezb</a>
               </v-list-item-subtitle>
               <v-list-item-subtitle>  <v-icon large color="black darken-2"> mdi-github</v-icon> <a href="https://github.com/edwinHernandezB" 
               target="_blank">edwinHernandezB</a>
               </v-list-item-subtitle>


      </v-list-item-content>
        <v-list-item-avatar size="80"
        color="grey" tile>
            <v-img src="../assets/perfil.png"></v-img>
          </v-list-item-avatar>

    </v-list-item>

  </v-card>
     <v-row>
       <v-col>
          <v-img style="display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;"
                src="../assets/Escola ingenieria.png"
                max-width="180"
                >
          </v-img>
       </v-col>
       <v-col>
          <v-img   class="mt-2"  style="display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;"
                src="../assets/logo_deic.png"
                max-width="180"
                >
          </v-img>
       </v-col>
       <v-col>
  <v-img   class="mt-2"  style="display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;"
                src="../assets/Logo_uab.png"
                max-width="180"
                >
          </v-img>
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
