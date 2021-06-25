<template>
  <v-container fluid>
    <v-app-bar app clipped-left elevation="0" class="vAppBar" height="40" >
      <h4>Ruta de paquetes</h4>
    </v-app-bar>
    <v-row class="ml-1">
      <!-- Select option -->
      <v-col cols="12" md="4">
        <v-select style="margin-top:20px;" 
          :items="accions" label="Elige una opción"
          solo v-model="activeAction" color="info">
        </v-select>
      </v-col>
    </v-row>

    <!-- Alert Info-->
    <v-alert text v-if="hideInfoAlert" color="info" class="mt-2  ml-3">
      <h4> Información sobre esta funcionalidad </h4>

      <div>
        Se utiliza la utilidad de Linux de <strong>nslookup</strong> para resolver el nombre de dominio de una IP, 
        <strong>traceroute</strong> para trazar la ruta tomada por los paquetes y una API llamada
        <a href="https://ipapi.co/#api" target="_blank"><u><strong>ipapi</strong></u></a> para encontrar la Geolocalización de una IP.
          Se ha de seleccionar una opción de la lista e introducir la IP o el nombre de dominio según sea el caso y presionar a <strong>Ejecutar.</strong>
        <br><br>
      
        Se ha de tener en cuenta lo siguiente:
        <ul>
          <li>La opción de <strong> trazar ruta de un paquete </strong> puede tardar unos segundos en función del número de saltos hechos 
            hasta llegar o no al destino</li>
          <li>El mapa <strong>solo mostrará IP's públicas </strong>, puede darse el caso que un salto se haya realizado por una interfaz de una red privada y
          puede deberse a varios factores como la configuración propia de la red o incluso basada en la mejor métrica (por ejemplo el RTT registrado por una ruta ya conocida).
          </li>
          <li>La información completa de todos los saltos se reflejan en una tabla</li>
          <li>Si desea ver información más detallada de una localización, puede clicar la caja de información mostrada en la ubicación</li>
          <li><strong>Intentar resolver una IP privada</strong> que no forme parte de tu propia LAN <strong>dará como resultado un error</strong>. 
            De igual manera, <strong>trazar una ruta de una IP privada no será posible</strong>
          </li>
        </ul>
            
      </div>
      <v-btn class="mt-1" color="info"  @click="hideInfoAlert = !hideInfoAlert" outlined>Aceptar</v-btn>
    </v-alert>

    <!--Form IP de host y Nombre de Dominio-->
    <v-form >
      <v-container fluid v-if="activeAction != ''">
        <!--Form de IP-->
        <v-row v-if="activeAction != accions[3]">
          <v-col  cols="12" md="2">
            <v-text-field v-model="IP" :rules="rulesIP"  label="IP de host" required></v-text-field>
          </v-col>
          
          <!--Button Ejecutar IP-->
          <v-btn color="success" class="mt-6 ml-5 " :disabled="!isCorrectIP" @click="ejecutar"> Ejecutar </v-btn>  
        </v-row>
        
        <!--Alerta para mostrar resultado de resolver dominio de un IP-->
        <v-alert v-if="auxAction == IP  && accions.indexOf(activeAction) == 2 && isIPToDomain" class="mt-5"
          border="left"
          color="light-blue lighten-2"
          dark>
          <v-row class="ml-1">
            <h4>IP: {{IP}}</h4>
          </v-row>
          
          <v-row class="ml-1">
            <h4>Dominio: {{result}}</h4>
          </v-row>
        </v-alert>
        
        <!--Form Nombre de dominio-->
        <v-row v-if="activeAction == accions[3]" >
          <v-col cols="12" md="2">
            <v-text-field v-model="domain" :rules="rulesDomain" label="Nombre de dominio" required></v-text-field>
          </v-col>

          <!--Button Ejecutar Nombre de Dominio-->
          <v-btn color="success"  class="mt-6 ml-5 " :disabled="!isDomainNull" @click="ejecutar"> Ejecutar </v-btn>
        </v-row>
        
        <!--Alerta para mostrar resultado de resolver IP de un dominio-->
        <v-alert v-if="auxAction == domain  && accions.indexOf(activeAction) == 3 && isDomainNull" class="mt-5"
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
  
    <!-- Opción IP Geolocation--> 
    <!-- map -->
    <v-container  fluid v-if="accions.indexOf(activeAction) == 1" class="mt-1" style="height: 600px; width: 100%" >
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

        
    <!-- Opción traceroute--> 
    <!-- map -->
    <v-container  fluid v-if="accions.indexOf(activeAction) == 0" class="mt-1" style="height: 600px; width: 100%" >
      <l-map
        v-if="showMap" :zoom="zoom" :center="[40, -10]" :options="mapOptions"
        style="height: 80%; position: relative; z-index: 2; " @update:center="centerUpdate" @update:zoom="zoomUpdate"
      >
        <l-tile-layer :url="url" :attribution="attribution"/>
        <l-marker  v-for="(location,index) in traceRoute" :key="location.IP"  :lat-lng="[location.Latitud, location.Longitud]">
            <l-tooltip :options="{ permanent: true, interactive: true }">
              <div @click="innerClickRoute(index)">
                Hop: {{location.ID}} <br>
                IP: {{location.IP}} <br>
                Organización: {{location.Organizacion}}
              </div>
            </l-tooltip>  
        </l-marker>-
      </l-map>
    
      <!-- Table -->     
      <v-card>
        <v-card-title>
          Paquetes 
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscador"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="desserts"
          :search="search"
        ></v-data-table>
      </v-card>
    </v-container>
    <!-- Alerta de error de tiempo excedido en la petición-->
    <v-alert :value="alertError" type="error"> 
      Tiempo excedido para la petición
      {{axiosErr}}      
    </v-alert>
      {{axiosErr}}

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
      //--------------Datos generales----------------------------
      accions: ['Trazar ruta de un paquete', 'Mostrar geolocalización de una IP', 
      'Resolver nombre de dominio de una IP', 'Encontrar IP de un nombre de dominio'],
      activeAction: '',
      auxAction: '',
      IP: '',
      domain: '',
      result: '',
      isIPToDomain: false,
      hideInfoAlert: true,
      //--------------map-----------------------------
      zoom: 3,
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
      //-------------pipapi---------------------------------------
      ipInformation: {
        IP: '',
        Pais: '',
        Ciudad: '',
        Region: '',
        Codigo: '',
        Ciudad: '',
        Latitud: 40,
        Longitud: -10,
        Organizacion: '',
      },
      locationDetail: {},
      traceRoute: [{Latitud: 40, Longitud: -10}],
      traceRouteInfo: [],
      alertError: false,
      axiosErr: '',
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
      //------------- RTT table ------------------
      search: '',
      headers: [
      {
        text: 'HOP',
        align: 'start',
        sortable: false,
        value: 'HOP',
       },
       { text: 'IP', value: 'IP' },
       { text: 'RTT1 (ms)', value: 'RTT1' },
       { text: 'RTT2 (ms)' , value: 'RTT2' },
       { text: 'RTT3 (ms)', value: 'RTT3' },
      ],
      desserts: [],
    }
  },
  methods: {
    ejecutar: function(){
      let selectedOption = this.accions.indexOf(this.activeAction)
      let params = { value: this.activeAction == this.accions[3] ? this.domain: this.IP, 
                     option: selectedOption}
        
      if (selectedOption == 0) {
        this.traceRoute = []
        this.desserts = []
        axios
        .get('http://localhost:4000/packetPath', { params })
        .then(response =>{
        let str = response.data.toString();
        
        if(str.includes('Error has ocurred'))
        {
          this.axiosErr = response
          this.alertError = !this.alertError
          setTimeout(()=>{ this.alertError=false },10000)
          return
        }
          this.auxAction = this.IP
          let res = response.data.split('\n').map(value => value.match(/[^ |ms]+/g)).splice(1, response.data.length -1)

          for (let index = 0; index < res.length-1; index++) {
            this.desserts.push({
              HOP: res[index][0], 
              IP: res[index][1],
              RTT1: res[index].splice(2,1),
              RTT2: res[index].splice(2,1),
              RTT3: res[index].splice(2,1),
            })
            
            if (res[index][1].match(/\b(?!(10)|192\.168|172\.(2[0-9]|1[6-9]|3[0-2]))[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/)) {
            axios
            .get('https://ipapi.co/' + res[index][1]  +'/json/')
            .then(response =>{
              this.traceRoute.push({
              ID: res[index][0],
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
              this.traceRouteInfo.push(response.data)
            })
           
            }
          }
        })
      
      }else if (selectedOption == 1) {
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
      }else {

         axios
        .get('http://localhost:4000/packetPath', { params })
        .then(response =>{
          switch (selectedOption) {
            case 2:
              this.result = response.data
              this.auxAction = this.IP
              this.isIPToDomain = !this.isIPToDomain
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
      this.currentCenter = [];
    },
    innerClick() {
      alert(JSON.stringify(this.locationDetail, null, 4));
    },
    innerClickRoute(index) {
      alert(JSON.stringify(this.traceRouteInfo[index], null, 4));
    }
  },
 
}
</script>

<style scoped>
.vAppBar{
  position:fixed; 
  top:40px;
}
a { 
  color: inherit;

 } 
</style>