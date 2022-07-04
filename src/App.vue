<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Rapid Reader
        </q-toolbar-title>

        <div>
          <q-btn round flat @click="showHelp = true">?</q-btn>
          <q-toggle
            v-model="darkModeState"
            checked-icon="light_mode"
            color="amber-5"
            unchecked-icon="dark_mode"
            @click="this.$q.dark.toggle()"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view/>
      <q-dialog v-model="showHelp">
        <q-card>
          <q-card-section>
          <span >
            <a
              href="javascript:window.location='https://dragere.github.io/RapidReader/#/_url_'.replace('_url_',window.getSelection().toString().length > 0 ? encodeURIComponent(window.getSelection().toString()):'');">Read this</a>
            Bookmarklet
          </span>
          </q-card-section>

          <q-card-section class="q-pt-none">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>
<script>
import {defineComponent} from 'vue';
import {debounce} from "quasar";
import $bus from 'src/Plugins/event.js';

export default defineComponent({
  name: 'App',

  data() {
    return {
      darkModeState: true,
      showHelp: false
    }
  },


  created: function () {
    document.addEventListener('keydown', debounce(this.handleKeyDown, 100));
  },
  unmounted: function () {
    document.removeEventListener('keydown', debounce(this.handleKeyDown, 100));
  },

  methods: {
    handleKeyDown(evt) {
      if (evt.target.nodeName === "TEXTAREA") return
      // console.log(evt)
      $bus.trigger('keypress-event', evt)
      // if(evt.key !== " ") return
      // evt.preventDefault()
      // evt.stopPropagation();
    }
  }
})

/***
 * Ideas:
 *
 * Key to bookmark: b to highlight the current word
 *
 * https://en.wikipedia.org/wiki/Rapid_serial_visual_presentation
 * -> Periphal reading
 *
 * */
</script>


