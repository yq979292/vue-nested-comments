<template>
  <div class="home">
      <div v-for="l in list" :key="l.id">
        <router-link :to="'/detail/' + l.id">{{l.id}}---{{l.title}}--{{l.author}}---{{l.source}}</router-link>
      </div>
  </div>
</template>

<script>
import axios from "axios"
export default {
  name: 'home',
  data(){
    return {
      list:[]
    }
  },
  mounted() {
    axios.get("/api/news").then(res=>{
      this.list = res.data.list;
    })
  },
}
</script>
