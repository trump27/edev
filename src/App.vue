<template>
  <div>
    <navbar></navbar>
    <div class="container">
      <router-view transition="route"></router-view>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  components: {
    Navbar
  }
}
</script>

<style lang="stylus">
.route-transition
  transition all 0.8s ease
.route-leave
  display none
.route-enter
  opacity 0
  padding 0 0
  height 0
  transform translate3d(0, 0, 0)
</style>
