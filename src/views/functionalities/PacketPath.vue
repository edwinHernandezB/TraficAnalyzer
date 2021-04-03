<template>
<v-container fluid>
 <v-app-bar app clipped-left elevation="0" class="vAppBar" height="40" >
    <v-app-bar-title>Ruta de paquete</v-app-bar-title>
  </v-app-bar>
   <v-row>
        <!-- Select option -->
        <v-col cols="12" md="4">
          <v-select style="margin-top:20px;" 
            :items="accions" label="Elige una opción"
            solo v-model="activeAction" color="info">
          </v-select>
        </v-col>
        
      </v-row>


<v-form >
    <v-container fluid v-if="activeAction != ''">
   
      <v-row v-if="activeAction != accions[3]">
        
        <v-col  cols="12" md="2">
          <v-text-field v-model="IP" :rules="rulesIP"  label="IP de host" required></v-text-field>
        </v-col>
  
        <!--Button Ejecutar y Finalizar-->
        <v-btn color="success" class="mt-6 ml-5 " :disabled="!isCorrectIP" @click="ejecutar"> Ejecutar </v-btn>
        
       
      </v-row>
      <v-alert v-if="auxAction == IP  && accions.indexOf(activeAction) == 2 && isCorrectIP" class="mt-1"
      border="left"
      color="light-blue lighten-2"
      dark
    >
    <v-row class="ml-1">
      <h4>IP: {{IP}}</h4>
    </v-row>
     <v-row class="ml-1">
      <h4>Dominio: {{result}}</h4>
    </v-row>
    </v-alert>
       <v-row v-if="activeAction == accions[3]" >
        <v-col cols="12" md="2">
          <v-text-field v-model="domain" :rules="rulesDomain" label="Nombre de dominio" required></v-text-field>
        </v-col>
        <!--Button Ejecutar y Finalizar-->
        <v-btn color="success"  class="mt-6 ml-5 " :disabled="!isDomainNull" @click="ejecutar"> Ejecutar </v-btn>
      </v-row>
    <v-alert v-if="auxAction == domain  && accions.indexOf(activeAction) == 3 && isDomainNull" class="mt-1"
      border="left"
      color="light-blue lighten-2"
      dark
    >
    <v-row class="ml-1">
      <h4>Dominio: {{domain}}</h4>
    </v-row>
     <v-row class="ml-1">
      <h4>IP: {{result}}</h4>
    </v-row>
    </v-alert>
    {{ipInformation}}
    {{auxAction}}
    <!-- opcion 2-->
  <v-alert v-if="auxAction == IP  && accions.indexOf(activeAction) == 1 && isCorrectIP" class="mt-1"
      border="left"
      color="light-blue lighten-2"
      dark
    >
    <v-row class="ml-1"> <h4>IP: {{ipInformation.IP}}</h4> </v-row>
    <v-row class="ml-1"> <h4>País: {{ipInformation.Pais}}</h4> </v-row>
    <v-row class="ml-1"> <h4>Código: {{ipInformation.Codigo}}</h4> </v-row>
    <v-row class="ml-1"> <h4>Ciudad: {{ipInformation.Ciudad}}</h4> </v-row>
    <v-row class="ml-1"> <h4>Latitud: {{ipInformation.Latitud}}</h4> </v-row>
    <v-row class="ml-1"> <h4>Longitud: {{ipInformation.Longitud}}</h4> </v-row>
    <v-row class="ml-1"> <h4>Organizacion: {{ipInformation.Organizacion}}</h4> </v-row>
   
    </v-alert>
    </v-container>
  </v-form>

  <!-- map -->
   <div style="height: 500px; width: 100%" >
    <div style="height: 200px overflow: auto;">
      <p>First marker is placed at {{ withPopup.lat }}, {{ withPopup.lng }}</p>
      <p>Center is at {{ currentCenter }} and the zoom is: {{ currentZoom }}</p>
      <button @click="showLongText">
        Toggle long popup
      </button>
      <button @click="showMap = !showMap">
        Toggle map
      </button>
    </div>
    <l-map
      v-if="showMap"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      style="height: 80%"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
      />
            <l-marker :lat-lng="[47.414407, -1.247013]" > </l-marker>
      <l-marker :lat-lng="[47.413037, -1.248199]" >
        <l-popup>
          <div @click="innerClick">
            I am a popup
            <p v-show="showParagraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              sed pretium nisl, ut sagittis sapien. Sed vel sollicitudin nisi.
              Donec finibus semper metus id malesuada.
            </p>
          </div>
        </l-popup>
      </l-marker>
      <l-marker :lat-lng="withTooltip">
        <l-tooltip :options="{ permanent: true, interactive: true }">
          <div @click="innerClick">
            I am a tooltip
            <p v-show="showParagraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              sed pretium nisl, ut sagittis sapien. Sed vel sollicitudin nisi.
              Donec finibus semper metus id malesuada.
            </p>
          </div>
        </l-tooltip>
      </l-marker>
    </l-map>
  </div>
  <!-- map -->

</v-container>
</template>

<script>
import axios from 'axios'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from "vue2-leaflet";
import 'leaflet/dist/leaflet.css';

export default {
  name: 'PacketPath',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip
  },
  data() {
    return {
      //--------------map-----------------------------
      zoom: 13,
      center: latLng(47.41322, -1.219482),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      withPopup: latLng(47.41322, -1.219482),
      withTooltip: latLng(47.41422, -1.250482),
      currentZoom: 11.5,
      currentCenter: latLng(47.41322, -1.219482),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5
      },
      showMap: true,
      //--------------------------------------------
      accions: ['Trazar ruta de un paquete', 'Mostrar geolocalización de una IP', 
      'Resolver nombre de dominio de una IP', 'Encontrar IP de un nombre de dominio'],
      activeAction: '',
      auxAction: '',
      IP: '',
      domain: '',
      result: '',
      ipInformation: {},
      //----------- Rules form --------------
      isCorrectIP: false,
      isDomainNull: false,
      rulesIP:[
         v => !!v || 'IP es requerida',
         v => /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(v) || 'Formato de IP incorrecto',
         v => { if(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(v)){ this.isCorrectIP = true}else { this.isCorrectIP = false} return true }
      ],
      rulesDomain: [
        v => !!v || 'Dominio es requerido',
        v => { if(/[^ ]+/g.test(v)){ this.isDomainNull = true}else { this.isDomainNull = false} return true }

        
      ],
    }
  },
  methods: {
    ejecutar: function(){
      let selectedOption = this.accions.indexOf(this.activeAction)
      let params = { value: this.activeAction == this.accions[3] ? this.domain: this.IP, 
                     option: selectedOption}

      if (selectedOption == 0) {
        
      } else if (selectedOption == 1) {
        axios
        .get('https://ipapi.co/'+ this.IP + '/json/')
        .then(response =>{
           this.auxAction = this.IP
           console.log(response.data);
           this.ipInformation = {
             IP: response.data.ip,
             Pais: response.data.country_name,
             Codigo: response.data.country_code_iso3,
             Ciudad: response.data.city,
             Latitud: response.data.latitude,
             Longitud: response.data.longitude,
             Organizacion: response.data.org,
            }
            console.log(this.ipInformation);
        })
      } else {

         axios
        .get('http://localhost:4000/packetPath', { params })
        .then(response =>{
          switch (selectedOption) {
            case 2:
              this.result = response.data
              this.auxAction = this.IP
              break;
            case 3:
              this.auxAction = this.domain
              this.result = response.data
              break;
          
            default:
              break;
          }
          console.log(response.data);
        })
      }
     

    },
    //--------------- map -----------------------
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },
    innerClick() {
      alert("Click!");
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