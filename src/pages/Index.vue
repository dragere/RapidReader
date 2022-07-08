<template>
  <q-page class="">
    <word-display ref="display" class="row" :word="allWords[this.counter]" :wordRate="wordRate" :size="fontSize"/>
    <div class="row justify-center">
      <div class="column" style="width: 66%;">
        <div class="row justify-center q-mb-md">
          <q-btn-group spread>
            <q-btn
              flat
              class="q-br"
              :icon="!play?'play_arrow':'pause'"
              aria-label="play_arrow"
              @click="handleStartButtonClick"
            />
            <q-btn-group class="q-br">
              <q-btn
                flat
                icon="chevron_left"
                aria-label="chevron_left"
                @click="jumpWords(-1)"
              />
              <q-btn
                flat
                icon="chevron_right"
                aria-label="chevron_right"
                @click="jumpWords(1)"
              />
            </q-btn-group>
            <q-btn-group>
              <q-btn
                flat
                icon="add"
                aria-label="add"
                @click="fontSize++"
              />
              <q-btn
                flat
                icon="remove"
                aria-label="remove"
                @click="fontSize--"
              />
            </q-btn-group>
          </q-btn-group>
        </div>
        <q-item class="row">
          <q-item-section side class="col-auto">
            <q-icon name="speed"/>
          </q-item-section>
          <q-item-section class="col">
            <q-slider
              v-model="wordRate"
              label-text-color="black"
              :min="50"
              :step="25"
              :max="1000"
              switch-label-side
              label-always
              switch-marker-labels-side
            />
          </q-item-section>
          <q-item-section class="col-auto">
            <span>
<!--              ca. {{ (allWords.length / wordRate * 60).toFixed() }} Sec-->
              {{ (allDelays.reduce((x, y) => x + y) / 1000).toFixed() }} Sec
            </span>
          </q-item-section>
        </q-item>
      </div>
    </div>
    <div class="row">
      <div class="col"></div>
      <div class="col-10">
        <q-slider class="row full-width" v-model="counter" :min="0" :max="allWords.length-1" label/>
        <HighlightingTextArea class="row full-width" @txtUpdate="updateText" :highlight="!play" :currentWord="counter"
                              :splitText="allWords" ref="TextArea"/>
      </div>
      <div class="col"></div>
    </div>

  </q-page>
</template>

<script>
import {defineComponent, ref} from 'vue';
import WordDisplay from "components/WordDisplay";
import HighlightingTextArea from "components/HighlightingTextArea";
import $bus from 'src/Plugins/event.js';


export default defineComponent({
  name: 'PageIndex',
  components: {HighlightingTextArea, WordDisplay},
  props: {
    readText: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      allWords: [''],
      allDelays: [0],
      counter: 0,
      play: false,
      expanded: false,
      wordRate: 300,
      fontSize: 26
    }
  },
  mounted() {
    const dbg = false
    if (this.readText) {
      const decoded = decodeURIComponent(this.readText)
      this.updateText(decoded)
      this.$refs.TextArea.setText(decoded)
    }
    $bus.on('keypress-event', evt => {
      switch (evt.code) {
        case 'ArrowUp':
          this.wordRate += 25
          if (dbg) console.log("Key: wr+")
          break
        case 'ArrowDown':
          this.wordRate -= 25
          if (dbg) console.log("Key: wr-")
          break
        case 'ArrowLeft':
          this.jumpWords(-1)
          if (dbg) console.log("Key: jmp-")
          break
        case 'ArrowRight':
          this.jumpWords(1)
          if (dbg) console.log("Key: jmp+")
          break
        case 'Space':
          if (dbg) console.log("Key: pause")
          this.handleStartButtonClick()
      }
    })
  },
  watch: {
    // currentWord() {
    //   return this.allWords[this.counter]
    // }
    wordRate() {
      this.updateDelays()
    }
  },
  methods: {
    handleStartButtonClick() {
      this.play = !this.play
      if (this.play) {
        this.startWords()
      }
    },

    async startWords() {
      while (this.play) {
        this.counter = (this.counter + 1) % this.allWords.length
        if (this.counter === 0) this.play = false
        // await sleep(this.getDelay(this.allWords[this.counter]))
        await sleep(this.allDelays[this.counter])
      }
    },

    /**
     * Jump words for- and backwards --> 1 = forwards, -1 = backwards
     * @param mul
     * @return {Promise<void>}
     */
    async jumpWords(mul = 1) {
      if (this.counter === 0 && mul === -1) return
      const oldPlay = this.play
      this.play = false
      for (let i = 0; i < 3; i++) {
        this.counter = (this.counter + mul) % this.allWords.length
        if (this.counter === 0) break
        // await sleep(this.getDelay(this.allWords[this.counter]) / 3)
        await sleep(this.allDelays[this.counter] / 3)
      }
      if (oldPlay) {
        this.handleStartButtonClick()
      }
    },

    updateText(txt) {
      // this.allWords = txt.split(/\s+/gm).flatMap(x => x.split(/-/gm).filter(y => y.length > 0))
      this.allWords = txt.split(/(?=\s\S)|(?<=[^-]-)/gm)//.map(x => x.trim()).filter(y => y.length > 0)
      this.updateDelays()
      this.counter = 0
    },
    updateDelays() {
      console.log("calc delays")
      this.allDelays = this.allWords.map(w => this.getDelay(w))
    },
    /**
     *
     * @param word {string} word to calculate delay for
     * @param numberPenalty unused
     * @param commaPenalty added multiplier when word ends with a comma (,)
     * @param semicolonPenalty added multiplier when word ends with a semicolon (;)
     * @param periodPenalty added multiplier when word ends with a period (.)
     * @param colonPenalty added multiplier when word ends with a colon (:)
     * @return {number} delay in ms
     */
    getDelay(word, numberPenalty = 2, commaPenalty = .3 , semicolonPenalty = .5, periodPenalty = .7, colonPenalty = .7) {

      const displayString = word.trim()
      const comma = displayString.endsWith(',')
      const semicolon = displayString.endsWith(';')
      const period = displayString.endsWith('.')
      const colon = displayString.endsWith(':')
      // const special = displayString.match(/^[A-ZÄÖÜ]?[a-zäüö]+[.,;:]?$/) === null

      const defaultDelay = 60 / this.wordRate * 1000;
      const penalty = (comma ? commaPenalty * defaultDelay : 0) +
        (semicolon ? semicolonPenalty * defaultDelay : 0) +
        (period ? periodPenalty * defaultDelay : 0) +
        (colon ? colonPenalty * defaultDelay : 0);
      // const mulNum = displayString.match(/^.*\d+.*$/) ? numberPenalty : 1
      // return defaultDelay * mulNum * this.normalizedLenght() + penalty
      return defaultDelay * this.normalizedLenght(word) + penalty
    },
    /**
     * multiplier for how long this word should be shown
     * based on nuber o
     *
     * @return number
     */
    normalizedLenght(word) {
      const x = word.length;
      // return (this.string.length - 6) ** 3 / 200 + 1;
      // return 0.000103853 * x ** 5 - 0.00414626 * x ** 4 + 0.0626928 * x ** 3 - 0.426316 * x ** 2 + 1.332 * x - 0.606007;
      if (x < 2) return 1
      if (x < 4) return .8
      if (x > 20) return 2
      if (x > 12) return 1.6
      if (x > 8) return 1.3
      return 1
    },
  }
})

function sleep(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*
todo :
 - scrollbar in textarea
 - variable font size (ctrl + up/down arrow)
 - stop highlighting on edit
 - multiple words at once https://github.com/LumingYin/SpeedReader / https://www.spreeder.com/app.php?intro=1
 */

</script>
