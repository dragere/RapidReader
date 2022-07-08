<script>
  import { theme } from "../store";
  export let input;
  export let size = 26;
  let displayMode = "single";
  let display;
  $: display = computeDisplay(input);

  function computeDisplay(w) {
    // console.log("Display: ");
    // console.log(w);
    if (typeof input === "string") {
      displayMode = "single";
      let word = w.trim();
      if (w === "") return ["", "", ""];
      let hightlightIndex = Math.round((word.length + 1) * 0.4) - 1;
      return [
        word.slice(0, hightlightIndex),
        word[hightlightIndex],
        word.slice(hightlightIndex + 1),
      ];
    } else {
      displayMode = "multi";
      console.log(w);
      return w == [""] ? [] : w;
    }
  }
</script>

<div
  id="wordDisplayContainer"
  class={$theme === "dark" ? "dark" : ""}
  style={"font-size: " + size + "px"}
>
  {#if displayMode === "single"}
    <div id="word">
      {#each display as _, i}
        <span id={`span_${i}`}>{display[i]}</span>
      {/each}
    </div>
  {:else}
    <style>
      #word:before,
      #word:after {
        border-color: transparent !important;
      }
    </style>

    <div class="flex flex-row justify-center gap-x-4">
      {#each display as _, i}
        <span>{display[i]}</span>
      {/each}
      <span class="w-0" style={"height: " + (1.5 * size + 5) + "px;"} />
    </div>
  {/if}
</div>

<style>
  #span_0 {
    width: 40%;
    text-align: right;
  }

  #span_1 {
    @apply text-orange-500;
  }

  #span_2 {
    width: 60%;
    text-align: left;
  }
  #word:before {
    top: 0;
  }

  #word:after {
    bottom: 0;
  }

  #word:before,
  #word:after {
    content: "";
    position: absolute;
    left: 40%;
    height: 0.8rem;
    width: 0;
    margin-left: -1px;
    border-left: 2px solid;
  }
  #wordDisplayContainer {
    border-top: 2px solid;
    border-bottom: 2px solid;
    position: relative;
    display: block;
    /* max-width: 30rem; */
    width: 25rem;
    padding: 1rem 0 1.2rem;
    font-size: 1em;
    margin: 10rem auto;
    background: linear-gradient(
      90deg,
      transparent,
      #fff 10%,
      #fff 90%,
      transparent
    );
  }

  #wordDisplayContainer.dark {
    background: linear-gradient(
      90deg,
      transparent,
      hsl(222deg 47% 8%) 10%,
      hsl(222deg 47% 8%) 90%,
      transparent
    );
  }

  #word {
    line-height: 1.6em;
    height: 1.7em;
    font-weight: 600;
    display: flex;
  }
</style>
