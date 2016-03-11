<template>
  <div class="hello">
    <h1>{{msg}}</h1>
    <p>This is Hello.vue.</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Hello World!',
      num1: 100,
      vals: {
        a: 1,
        b: true
      },
      arr: []
    }
  },
  created () {
  },
  methods: {
    /**
     * for unit test
     */
    changeValue () {
      this.num1 = 123
      this.vals.a = 7
      this.vals.b = false
      this.arr = [123, 234]
    }
  }
}
</script>
