<template>
  <div id="app">
    <Map class="map" />
  </div>
</template>

<script>
import Map from '@/components/Map'
export default {
  name: 'App',
  components: {
    Map
  }
}
</script>

<style lang="scss">
.map {
  height: 500px;
  width: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
