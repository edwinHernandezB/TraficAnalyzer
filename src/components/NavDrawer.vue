<template>
  <v-container>
    <v-navigation-drawer app absolute permanent expand-on-hover clipped>
      
      <!-- List of functionalities and Simulations grouped-->
      <v-list dense>

        <v-list-group v-for="item in toolList" :key="item.groupTitle"
        v-model="item.active" :prepend-icon="item.groupIcon">
        
          <!-- Main container (there are two, the Functionalities and Simulations-->
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.groupTitle"></v-list-item-title>
            </v-list-item-content>
          </template>

          <!-- For each container, print the icon and title of the different components-->
          <v-list-item v-for="component in item.components" :key="component.title"
            @click="call(component.action)">

            <v-list-item-icon >
              <v-icon>{{ component.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="component.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list-group>
           
        <!-- Other components like About -->
        <v-list-item @click="call(about.action)">
          <v-list-item-icon > <v-icon>{{ about.icon }}</v-icon></v-list-item-icon>
          <v-list-item-title>{{about.title}}</v-list-item-title>
        </v-list-item>                         
           
      </v-list>
       
    </v-navigation-drawer>
  </v-container>
</template>

<script>
export default {
    name: 'NavDrawer',
    data () {
      return {
        about:  { title: 'About', icon: 'mdi-information-outline', action: 'about' },
        toolList: [
            {
                groupIcon: 'mdi-hammer-wrench',
                components: [
                    { title: 'Packet Capture', icon: 'mdi-mail', action: 'packetCapture' },
                    { title: 'Check connection to host', icon: 'mdi-table-tennis', action: 'checkConn' },
                    { title: 'Status of packet paths', icon: 'mdi-map-marker-multiple', action: 'packetPath' },
                    { title: 'Find devices in network', icon: 'mdi-lan', action: 'findDevices' },
                    { title: 'Active Sockets', icon: 'mdi-lan-connect',action: 'activeSockets' },
                    { title: 'Statistics', icon: 'mdi-chart-bar', action: 'statistics' },
                ],
                groupTitle: 'Utilities',
            },
            {
                groupIcon: 'mdi-cube',
                components: [
                    { title: 'TCP Pill Concepts', icon: 'mdi-pill' },
                    { title: 'The Mother Of All Problems', icon: 'mdi-school' },
                ],
                groupTitle: 'Simulations'
            },
        ],
      }
    },
    methods:{
      onClickOutside: function(){
        this.$emit('clickOutside', true)
      },
      call(action) {
      console.log(action);
      },
    },    
}
</script>