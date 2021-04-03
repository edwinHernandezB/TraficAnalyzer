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
 
    </v-container>
  </v-form>

  <!-- opcion IP Geolocation--> 
  <!-- map -->
   <v-container  fluid v-if="auxAction == IP  && accions.indexOf(activeAction) == 1 && isCorrectIP" class="mt-1" style="height: 600px; width: 100%" >
    <l-map
      v-if="showMap" :zoom="zoom" :center="[ipInformation.Latitud, ipInformation.Longitud]" :options="mapOptions"
      style="height: 80%; position: relative; z-index: 2; " @update:center="centerUpdate" @update:zoom="zoomUpdate"
    >
      <l-tile-layer :url="url" :attribution="attribution"/>

      <l-marker :lat-lng="[ipInformation.Latitud, ipInformation.Longitud]">
        <l-tooltip :options="{ permanent: true, interactive: true }">
          <div @click="innerClick">
            IP: {{ipInformation.IP}} <br>
            Ciudad: {{ipInformation.Ciudad}} <br>
            Region: {{ipInformation.Region}} <br>
            País: {{ipInformation.Pais}} <br>
            Organizacion: {{ipInformation.Organizacion}} <br>
            <u> Click para más detalles</u>
          </div>
        </l-tooltip>
      </l-marker>
    </l-map>
   </v-container>

   <!-- Alerta de error de geo localización -->
      <v-alert :value="errorLocation" type="error"> 
        Error al realizar la petición, comprueba lo siguiente:
        <ul>
          <li>La IP introducida sea correcta</li>
          <li>No se trata de una IP privada</li>
        </ul>
      </v-alert>
  <!-- map -->
 <!-- opcion traceroute--> 
  <!-- map -->
   <v-container  fluid v-if="accions.indexOf(activeAction) == 0 && isTraceRoute" class="mt-1" style="height: 600px; width: 100%" >
    <l-map
      v-if="showMap" :zoom="zoom" :center="[ipInformation.Latitud, ipInformation.Longitud]" :options="mapOptions"
      style="height: 80%; position: relative; z-index: 2; " @update:center="centerUpdate" @update:zoom="zoomUpdate"
    >
      <l-tile-layer :url="url" :attribution="attribution"/>
      <!--<l-marker :lat-lng="[traceRoute[0].Latitud, traceRoute[0].Longitud]"></l-marker>-->
      <l-marker v-for="(location, index) in traceRoute" :key="location.IP"  :lat-lng="[location.Latitud, location.Longitud]"></l-marker>-
    </l-map>
   </v-container>
   {{traceRoute[0]}}
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
      zoom: 15,
      center: latLng(47.41322, -1.219482),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      currentZoom: 11.5,
      currentCenter: latLng(47.41322, -1.219482),
      mapOptions: {
        zoomSnap: 0.5
      },
      showMap: true,
      errorLocation: false,
      //--------------------------------------------
      accions: ['Trazar ruta de un paquete', 'Mostrar geolocalización de una IP', 
      'Resolver nombre de dominio de una IP', 'Encontrar IP de un nombre de dominio'],
      activeAction: '',
      auxAction: '',
      IP: '',
      domain: '',
      result: '',
      ipInformation: {
        IP: '',
        Pais: '',
        Ciudad: '',
        Region: '',
        Codigo: '',
        Ciudad: '',
        Latitud: 0,
        Longitud: -1,
        Organizacion: '',
      },
      locationDetail: {},
      traceRoute: [],
      isTraceRoute: false,
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
        let result =[]
        let values = []
        axios
        .get('http://localhost:4000/packetPath', { params })
        .then(response =>{
          
          let res = response.data.split('\n').map(value => value.match(/[^ |ms]+/g)).splice(1, response.data.length -1)
          for (let index = 0; index < res.length-1; index++) {
            result.push({
              id: res[index][0], 
              ip: res[index][1],
              rtt: res[index].splice(2,4)
            })
            
            if (res[index][1].match(/\b(?!(10)|192\.168|172\.(2[0-9]|1[6-9]|3[0-2]))[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/)) {
            axios
            .get('https://ipapi.co/' + res[index][1]  +'/json/')
            .then(response =>{
              values.push(response.data)
              this.traceRoute.push({
              IP: response.data.ip,
              Pais: response.data.country_name,
              Ciudad: response.data.city,
              Region: response.data.region,
              Codigo: response.data.country_code_iso3,
              Ciudad: response.data.city,
              Latitud: response.data.latitude,
              Longitud: response.data.longitude,
              Organizacion: response.data.org,
             })
            })
            }
          }
          this.isTraceRoute = !this.isTraceRoute
        })
  

        
        
      } else if (selectedOption == 1) {
        axios
        .get('https://ipapi.co/'+ this.IP + '/json/')
        .then(response =>{
          if (response.data.longitude != undefined && response.data.latitude != undefined) {
             this.auxAction = this.IP
            this.locationDetail = response.data
            this.ipInformation = {
              IP: response.data.ip,
              Pais: response.data.country_name,
              Ciudad: response.data.city,
              Region: response.data.region,
              Codigo: response.data.country_code_iso3,
              Ciudad: response.data.city,
              Latitud: response.data.latitude,
              Longitud: response.data.longitude,
              Organizacion: response.data.org,
             }
          } else {
           console.log('error');
           this.errorLocation = !this.errorLocation
           setTimeout(()=>{ this.errorLocation=false },5000)
          }
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
    innerClick() {
      alert(JSON.stringify(this.locationDetail, null, 4));
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