<template>
  <v-container >
    <v-navigation-drawer app absolute permanent expand-on-hover clipped class="vNavDrawer">
      
      <!-- List of functionalities and Simulations grouped-->
      <v-list dense>

        <v-list-group  v-for="item in toolList" :key="item.groupTitle"
        v-model="item.active" :prepend-icon="item.groupIcon" color="info" class="vListGroup">
        
          <!-- Main container (there are two, the Functionalities and Simulations-->
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.groupTitle"></v-list-item-title>
            </v-list-item-content>
          </template>

          <!-- For each container, print the icon and title of the different components-->
          <v-list-item v-for="component in item.components" :key="component.title" class="vListIten"

            :to="/functionalities/ + component.action">

            <v-list-item-icon >
              <v-icon>{{ component.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="component.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list-group>
           
        <!-- Other components like About -->
        <v-list-item to="/About" class="vListIten">
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
                    { title: 'Packet Capture', icon: 'mdi-mail', action: 'PacketCapture' },
                    { title: 'Check connection to host', icon: 'mdi-table-tennis', action: 'CheckConn' },
                    { title: 'Status of packet paths', icon: 'mdi-map-marker-multiple', action: 'PacketPath' },
                    { title: 'Find devices in network', icon: 'mdi-lan', action: 'FindDevices' },
                    { title: 'Active Sockets', icon: 'mdi-lan-connect',action: 'ActiveSockets' },
                    { title: 'Statistics', icon: 'mdi-chart-bar', action: 'Statistics' },
                ],
                groupTitle: 'Utilities',
            },
            {
                groupIcon: 'mdi-cube',
                components: [
                    { title: 'TCP Pill Concepts', icon: 'mdi-pill', action: 'TCPconcepts' },
                    { title: 'The Mother Of All Problems', icon: 'mdi-school', action: 'MotherAllProblems' },
                ],
                groupTitle: 'Simulations'
            },
        ],
      }
    },
    methods:{
      call(action) {
        //@click="call(component.action)"

      console.log(action);
      },
    },    
}
</script>

<style scoped>
.vNavDrawer{
  position:fixed;
}
.vListGroup{
}
.vListIten{
  text-decoration: none;
}
a {
  text-decoration: none;
}
</style>