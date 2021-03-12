<template> 
   <v-container>
       <v-navigation-drawer
      v-model="drawerActive"
      absolute
      temporary
       v-click-outside="onClickOutside"
    >
      <v-list-item>
      
        <v-list-item-content>
             <v-img src="../assets/TraficAnalyzer_logo.png"></v-img>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
   </v-container>

</template>

<script>
export default {
    name: 'NavDrawer',
    props: ['drawerActive'],
    data () {
      return {
        items: [
          { title: 'Home', icon: 'mdi-view-dashboard' },
          { title: 'About', icon: 'mdi-forum' },
        ],
      }
    },
     methods:{
        onClickOutside: function(){
            this.$emit('clickOutside', true)
        }
    }
}
</script>