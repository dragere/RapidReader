<template>
  <div id="container">
    <div id="word">
      <span v-for="i in 3" :key="i" :id="'span_'+i">{{ splitWord[i-1] }}</span>
    </div>
  </div>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: "WordDisplay",
  props: {
    word: {
      type: String,
      required: true
    },
    wordRate: {
      type: Number,
      required: true
    }
  },
  computed: {
    splitWord() {
      let word = this.word.trim()
      let hightlightIndex = Math.round((word.length + 1) * 0.4) - 1;
      return [word.slice(0, hightlightIndex), word[hightlightIndex], word.slice(hightlightIndex + 1)]
    }
  }
})
</script>

<style scoped lang="scss">

@import "src/css/quasar.variables";

#span_1 {
  width: 40%;
  text-align: right;
  //direction: rtl;
}

#span_2 {
  @include themify {
    color: $accent-fg;
  }
}

#span_3 {
  width: 60%;
  text-align: left;
}

#container {
  border-top: 2px solid;
  border-bottom: 2px solid;
  position: relative;
  display: block;
  max-width: 30rem;
  width: 25rem;
  padding: 1rem 0 1.2rem;
  font-size: 1em;
  margin: 10rem auto;
  @include themify{
    background: linear-gradient(
        90deg
      , $primary-bg 0%, $secondary-bg 10%, $secondary-bg 90%, $primary-bg 100%);
  }
}

#word {
  font-size: 1.6em;
  line-height: 1.6em;
  height: 1.7em;
  font-weight: 600;
  display: flex;
}

#word:before, #word:after {
  content: "";
  position: absolute;
  left: 40%;
  height: 0.8rem;
  width: 0;
  margin-left: -1px;
  border-left: 2px solid;
}

#word:before {
  top: 0;
}

#word:after {
  bottom: 0;
}

</style>
