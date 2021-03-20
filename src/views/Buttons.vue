<template>
    <v-container>
        <v-row>
            <v-col>
                <v-btn>Button</v-btn>
                <v-btn color="primary" class="ml-2">Button</v-btn>
                <v-btn  dark color="blue">Button</v-btn>
                <v-btn  flat >Button</v-btn>
                <v-btn color="primary" large>Button</v-btn>
                <v-btn color="primary" small>Button</v-btn>
                <v-btn color="primary" :disabled="true">Button</v-btn>
                <v-btn block>
                    <v-icon>mdi-heart</v-icon>
                </v-btn>
                <v-btn icon flat>
                    <v-icon>mdi-heart</v-icon>
                </v-btn>
                  <v-btn fab>
                    <v-icon>mdi-heart</v-icon>
                </v-btn>
                <v-btn>
                    Like
                    <v-icon class="ml-2">mdi-heart</v-icon>
                </v-btn>
                <v-btn>
                    <v-icon left>mdi-heart</v-icon>
                    Like
                </v-btn>  
                 <v-btn outlined>
                    Like
                    <v-icon  class="ml-2">mdi-heart</v-icon>
                </v-btn>  
                
            </v-col>
        </v-row>
    </v-container>
        
    
</template>
<script>
export default {
    data() {
        return {
            
        }
    },
}
</script>