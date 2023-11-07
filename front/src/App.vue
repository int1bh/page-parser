<template>
  <div id="app">
    <SiteInfo />
  </div>
</template>

<script>
import SiteInfo from './components/SiteInfo.vue'

export default {
  name: 'App',
  components: {
    SiteInfo
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
