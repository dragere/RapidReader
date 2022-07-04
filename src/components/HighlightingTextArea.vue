<template>
  <div class="container">
    <div class="wordContainer fit">
      <div :hidden="!highlight" class="backdrop box" ref="backdrop">
        <mark class="highlights" v-if="highlightText !== ''">{{ highlightText }}</mark>
        {{ noHighlightText }}
      </div>
      <textarea
        class="textInput box"
        placeholder="Paste Text here to read."
        v-model="text"
        ref="textarea"
        @focus="e => e.target.select()"
        @scroll="onScroll"
        @change="newText">
      </textarea>
      <q-icon name="close" @click="clearText()" class="cursor-pointer"/>
    </div>
  </div>
</template>

<script>

export default {
  name: "HighlightingTextArea",
  props: {
    currentWord: {
      type: Number,
      required: false,
      default: 0
    },
    highlight: {
      type: Boolean,
      required: true
    },
    splitText:{
      type: Array,
      required: true
    }
  },
  emits: {
    txtUpdate: {
      type: Object
    }

  },
  computed: {
    /*splitText() {
      // return this.text.replaceAll('\n', '<br>').split(/(?=\s\S)/gm);
      // return this.text.split(/(?=\s\S)/gm);
      return this.text.split(/(?=\s\S)|(?<=[^-]-)/gm);
    },*/
    highlightText() {
      if (this.currentWord < 1) return ""
      return this.splitText.slice(0, this.currentWord + 1).reduce((x, y) => x + y)
    },
    noHighlightText() {
      if (this.currentWord >= this.splitText.length - 1 || this.splitText.length < 1) return ""
      return this.splitText.slice(this.currentWord, this.splitText.length - 1).reduce((x, y) => x + y)
    }
  },
  data() {
    return {
      text: '',
    }
  },
  methods: {
    newText() {
      this.$emit('txtUpdate', this.text)
    },
    clearText() {
      this.text = ""
      this.newText()
    },
    setText(t) {
      this.text = t
    },
    async onScroll() {
      this.$refs.backdrop.scrollTop = this.$refs.textarea.scrollTop;
      this.$refs.backdrop.scrollLeft = this.$refs.textarea.scrollLeft;
    }
  }
}


</script>

<style scoped lang="scss">

@import "src/css/quasar.variables";

.textInput {
  box-sizing: border-box;
  background: transparent;

  display: block;
  z-index: 2;
  margin: 0;
  border: 2px solid #74637f;
  border-radius: 0;
  overflow: visible;
  transition: transform 1s;

  resize: none;

  @include themify {
    color: $primary-fg;
  }
}

.highlights {
  white-space: pre-wrap;
  word-wrap: break-word;
  border-radius: 3px;
  background-color: #b4893163;

  @include themify {
    //background-color: $accent-bg;
    color: $primary-fg;
  }
}

.backdrop {
  z-index: 1;
  padding: 2px 2px 2px 2px;
  border: 2px solid #596b72;
  color: transparent;
  overflow: hidden;
  pointer-events: none;
  transition: transform 1s;
  resize: none;
  position: absolute;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.progressBar {
  display: block;
  height: 3px;

  @include themify {
    background-color: $accent-bg;
  }
}

.wordContainer {
  display: block;
  position: relative;
  margin: 0;
}

.box {
  width: 100%;
  height: 300px;
}

</style>
