<template>
  <div id="container">
    <input type="text" :value="displayString"/>
  </div>
</template>

<script>

export default {
  name: 'Word',
  props: {
    str: {
      type: String,
      required: true
    },
    idx: {
      type: Number,
      required: true
    },
    currentIdx: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      displayString: this.str.trim(),
      comma: this.displayString.endsWith(','),
      semicolon: this.displayString.endsWith(';'),
      period: this.displayString.endsWith('.'),
      special: this.displayString.match(/^[A-ZÄÖÜ]?[a-zäüö]+[.,;:]?$/) === null
    }
  },
  methods: {
    /**
     * multiplier for how long this word should be shown
     * based on nuber o
     *
     * @return number
     */
    normalizedLenght() {
      const x = this.string.length;
      // return (this.string.length - 6) ** 3 / 200 + 1;
      // return 0.000103853 * x ** 5 - 0.00414626 * x ** 4 + 0.0626928 * x ** 3 - 0.426316 * x ** 2 + 1.332 * x - 0.606007;
      if (x < 4) return .8
      if (x > 8) return 1.3
      return 1
    },

    getDelay(wordRate, numberMultiplier = 2, commaPenalty = 25, semicolonPenalty = 40, periodPenalty = 100) {
      const defaultDelay = 60 / wordRate * 1000;
      const penalty = (this.comma ? commaPenalty : 0) + (this.semicolon ? semicolonPenalty : 0) + (this.period ? periodPenalty : 0);
      const mulNum = this.string.match(/^.*\d+.*$/) ? numberMultiplier : 0
      return defaultDelay * mulNum * this.normalizedLenght() + penalty
    }
  }
}

</script>
