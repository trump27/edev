<template>
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navmenu">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">Template</a>
      </div>
      <div class="collapse navbar-collapse" id="navmenu">
        <ul class="nav navbar-nav">
          <li><a v-link="'/'">Home</a></li>
          <li><a v-link="'/hello'">Hello</a></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>
