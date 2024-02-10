<script>
    import { createEventDispatcher, tick } from "svelte";

    export let highlight = false;
    export let currentWord = 0;
    export let splitText = [];

    let anchor;
    let textarea;
    let backdrop;

    let highlightText;
    let noHighlightText;
    let text = "";
    let textScrolled = false;
    let currentTimeout = undefined;

    $: highlightText = computeHighlightText(currentWord, splitText);
    $: noHighlightText = computeNoHighlightText(currentWord, splitText);
    $: scrollToAnchor(highlight);

    async function scrollToAnchor(hghlght) {
        // await new Promise((resolve) => setTimeout(resolve, 10))
        // afterUpdate(() => {
        //     console.log("scrollcall");
        //     if (anchor && hghlght) {
        //         anchor.scrollIntoView();
        //     }
        // });
        await tick();

        console.log("scrollcall");
        if (anchor && hghlght) {
            anchor.scrollIntoView();
            anchor.parentNode.scrollBy(0, -50);
        }
    }

    function computeHighlightText(crntWord, spltText) {
        if (crntWord < 1) return "";
        return spltText.slice(0, crntWord + 1).reduce((x, y) => x + y);
    }
    function computeNoHighlightText(crntWord, spltText) {
        if (crntWord >= spltText.length - 1 || spltText.length < 1) return "";
        return spltText
            .slice(crntWord, spltText.length - 1)
            .reduce((x, y) => x + y);
    }
    const dispatch = createEventDispatcher();

    function onFocus(e) {
        e.target.select();
    }

    function newText() {
        dispatch("txtUpdate", text);
    }
    function clearText() {
        text = "";
        newText();
    }
    export function setText(t) {
        text = t;
    }
    async function onTextScroll() {
        // console.log("TextScroll");
        if(!backdrop || !textarea) return
        clearTimeout(currentTimeout);
        textScrolled = true;
        backdrop.scrollTop = textarea.scrollTop;
        backdrop.scrollLeft = textarea.scrollLeft;
        currentTimeout = setTimeout(() => (textScrolled = false), 50);
    }
    async function onBackdropScroll() {
        // console.log("BackdropScroll");
        if(!backdrop || !textarea) return
        if (textScrolled) return;
        textarea.scrollTop = backdrop.scrollTop;
        textarea.scrollLeft = backdrop.scrollLeft;
    }
</script>

<div class="container">
    <div class="wordContainer fit">
        {#if highlightText !== ""}
            <div
                class:hidden={!highlight}
                class="backdrop box"
                bind:this={backdrop}
                on:scroll={onBackdropScroll}
            >
                <mark class="highlights">{highlightText}</mark>
                <span
                    bind:this={anchor}
                    id="anchor"
                    style="width: 0; height: 0"
                />
                {noHighlightText}
            </div>
        {/if}
        <textarea
            placeholder="Paste Text here to read."
            spellcheck="false"
            class="textInput box border-amber"
            bind:value={text}
            bind:this={textarea}
            on:focus={onFocus}
            on:scroll={onTextScroll}
            on:change={newText}
        />
<!--        <q-icon name="close" on:click={clearText} class="cursor-pointer" />-->
    </div>
</div>

<style>
    .textInput {
        box-sizing: border-box;
        background: transparent;

        display: block;
        z-index: 2;
        margin: 0;
        border: 2px solid;
        border-radius: 0;
        overflow: visible;
        transition: transform 1s;

        resize: none;
    }

    .highlights {
        white-space: pre-wrap;
        word-wrap: break-word;
        border-radius: 3px;
        background-color: #b4893163;
        color: transparent !important;
    }

    :global(.backdrop) {
        z-index: 1;
        padding: 2px 19px 2px 2px;
        /* border: 2px solid #596b72; */
        color: transparent !important;
        overflow: hidden;
        pointer-events: none;
        transition: transform 1s;
        resize: none;
        position: absolute;
        white-space: pre-wrap;
        word-wrap: break-word;
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
