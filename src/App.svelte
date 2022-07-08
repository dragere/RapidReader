<script>
    import { Icon } from "svelte-awesome";
    import "./app.css";
    import {
        chevronDown,
        chevronLeft,
        chevronRight,
        chevronUp,
        clockO,
        github,
        moonO,
        pause,
        play,
        questionCircle,
        sunO,
        tachometer,
    } from "svelte-awesome/icons";
    import Dialog from "./lib/Dialog.svelte";
    import WordDisplay from "./lib/WordDisplay.svelte";
    import Slider from "./lib/Slider.svelte";
    import { theme } from "./store";
    import HighlightingTextArea from "./lib/HighlightingTextArea.svelte";
    import { setContext, tick } from "svelte";
    /*
     https://docs.robbrazier.com/svelte-awesome/icons
     */

    const dbg = false;
    let showDialog = false;
    let playing = false;
    let currentIdx = 0;
    let rollSize = 1;
    let wordRate = 300;
    let fontSize = 26;
    let allDelays = [0];
    let allWords = [""];
    let TextArea;

    $: display = computeDisplay(currentIdx, allWords, rollSize);
    $: {
        updateDelays(allWords, wordRate);
    }

    function initialize() {
        // On page load or when changing themes, best to add inline in `head` to avoid FOUC
        if (
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            toggleTheme("dark");
        } else {
            toggleTheme("bright");
        }

        document.documentElement.addEventListener("keydown", (evt) => {
            // @ts-ignore
            if (evt.target.nodeName === "TEXTAREA") return;
            switch (evt.code) {
                case "ArrowUp":
                    if (evt.ctrlKey) {
                        fontSize++;
                        if (dbg) console.log("Key: fs+");
                        break;
                    }
                    wordRate += 25;
                    if (dbg) console.log("Key: wr+");
                    break;
                case "ArrowDown":
                    if (evt.ctrlKey) {
                        fontSize--;
                        if (dbg) console.log("Key: fs-");
                        break;
                    }
                    wordRate -= 25;
                    if (dbg) console.log("Key: wr-");
                    break;
                case "ArrowLeft":
                    if (evt.ctrlKey) {
                        if (rollSize > 1) rollSize--;
                        if (dbg) console.log("Key: rs-");
                        break;
                    }
                    jumpWords(-1);
                    if (dbg) console.log("Key: jmp-");
                    break;
                case "ArrowRight":
                    if (evt.ctrlKey) {
                        if (rollSize < 5) rollSize++;
                        if (dbg) console.log("Key: rs+");
                        break;
                    }
                    jumpWords(1);
                    if (dbg) console.log("Key: jmp+");
                    break;
                case "Space":
                    if (dbg) console.log("Key: pause");
                    handleStartButtonClick();
            }
        });

        tick().then(() => {
            console.log("Setting text");
            TextArea.setText(decodeURIComponent(window.location.hash.substring(2)));
        });
    }

    function toggleTheme(setTo = "") {
        let dark = !(
            setTo === "bright" ||
            ($theme === "dark" && setTo !== "dark")
        );
        if (dark) {
            if (dbg) console.log("dark");
            document.documentElement.classList.add("dark");
            localStorage.theme = "dark";
            $theme = "dark";
        } else {
            if (dbg) console.log("bright");
            document.documentElement.classList.remove("dark");
            localStorage.theme = "bright";
            $theme = "bright";
        }
    }
    /**
     * multiplier for how long this word should be shown
     * based on nuber o
     *
     * @return number
     */
    function normalizedLenght(word) {
        const x = word.length;
        // return (this.string.length - 6) ** 3 / 200 + 1;
        // return 0.000103853 * x ** 5 - 0.00414626 * x ** 4 + 0.0626928 * x ** 3 - 0.426316 * x ** 2 + 1.332 * x - 0.606007;
        if (x < 2) return 1;
        if (x < 4) return 0.8;
        if (x > 20) return 2;
        if (x > 12) return 1.6;
        if (x > 8) return 1.3;
        return 1;
    }
    function handleStartButtonClick() {
        playing = !playing;
        if (playing) {
            startWords();
        }
    }

    async function startWords() {
        while (playing) {
            currentIdx = currentIdx + rollSize;
            if (currentIdx >= allWords.length) currentIdx = 0;
            if (currentIdx === 0) playing = false;
            // await sleep(this.getDelay(this.allWords[this.counter]))
            await sleep(allDelays[currentIdx] * rollSize);
        }
    }

    /**
     * Jump words for- and backwards --> 1 = forwards, -1 = backwards
     * @param mul
     * @return {Promise<void>}
     */
    async function jumpWords(mul = 1) {
        if (currentIdx === 0 && mul === -1) return;
        const oldPlaying = playing;
        playing = false;
        mul *= rollSize;
        for (let i = 0; i < 3; i++) {
            currentIdx = currentIdx + mul;
            if (currentIdx >= allWords.length) currentIdx = 0;
            if (currentIdx === 0) break;
            // await sleep(this.getDelay(this.allWords[this.counter]) / 3)
            await sleep((allDelays[currentIdx] / 3) * rollSize);
        }
        if (oldPlaying) {
            handleStartButtonClick();
        }
    }

    function computeDisplay(crntIdx, allWds, rlSize) {
        if (rollSize === 1) return allWds[crntIdx];
        return allWds.slice(crntIdx, crntIdx + rlSize);
    }

    function updateText(txt) {
        if (dbg) console.log(txt);
        // this.allWords = txt.split(/\s+/gm).flatMap(x => x.split(/-/gm).filter(y => y.length > 0))
        allWords = txt.split(/(?=\s\S)|(?<=[^-]-)/gm); //.map(x => x.trim()).filter(y => y.length > 0)
        currentIdx = 0;
    }
    function updateDelays(words, wpm) {
        // console.log("calc delays");
        allDelays = words.map((w) => getDelay(w, wpm));
    }

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
    function getDelay(
        word,
        wpm,
        numberPenalty = 2,
        commaPenalty = 0.3,
        semicolonPenalty = 0.5,
        periodPenalty = 0.7,
        colonPenalty = 0.7
    ) {
        const displayString = word.trim();
        const comma = displayString.endsWith(",");
        const semicolon = displayString.endsWith(";");
        const period = displayString.endsWith(".");
        const colon = displayString.endsWith(":");
        // const special = displayString.match(/^[A-ZÄÖÜ]?[a-zäüö]+[.,;:]?$/) === null

        const defaultDelay = (60 / wpm) * 1000;
        const penalty =
            (comma ? commaPenalty * defaultDelay : 0) +
            (semicolon ? semicolonPenalty * defaultDelay : 0) +
            (period ? periodPenalty * defaultDelay : 0) +
            (colon ? colonPenalty * defaultDelay : 0);
        // const mulNum = displayString.match(/^.*\d+.*$/) ? numberPenalty : 1
        // return defaultDelay * mulNum * this.normalizedLenght() + penalty
        return defaultDelay * normalizedLenght(word) + penalty;
    }
    function sleep(ms = 1000) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const bookmarklet =
        "javascript:window.location='https://dragere.github.io/RapidReader/#/_url_'.replace('_url_',window.getSelection().toString().length > 0 ? encodeURIComponent(window.getSelection().toString()):'');";

    initialize();
</script>

<main class="flex flex-col p-0">
    <header class="flex flex-row justify-between bg-amber-600 px-2 py-3">
        <div class="justify-start text-xl font-semibold">Rapid Reader</div>
        <div class="justify-end">
            <button
                on:click={() => (showDialog = true)}
                class="w-8 hover:scale-125"
            >
                <Icon data={questionCircle} scale={2} />
            </button>
            <button on:click={() => toggleTheme()} class="w-8 hover:scale-125">
                <Icon data={$theme === "bright" ? moonO : sunO} scale={2} />
            </button>
            <a
                href="https://github.com/dragere/RapidReader"
                target="_blank"
                class="w-8 hover:scale-125"
            >
                <Icon class="hover:scale-125" data={github} scale={2} />
            </a>
        </div>
    </header>
    <div id="content" class="max-w-screen-2xl mx-4 justify-center self-center">
        <WordDisplay bind:input={display} size={fontSize} />

        <div class="flex flex-row flex-nowrap items-center">
            <div class="flex flex-col w-20">
                <Icon
                    data={tachometer}
                    scale={1.5}
                    class="flex-none self-center"
                />
                <span class="self-center">{wordRate} WPM</span>
            </div>
            <Slider
                class="flex-auto mx-1"
                step={25}
                min={50}
                max={1000}
                bind:value={wordRate}
            />
            <div class="flex flex-col w-14">
                <Icon data={clockO} scale={1.5} class="flex-none self-center" />
                <span class="flex-none self-center">
                    {(allDelays.reduce((x, y) => x + y) / 1000).toFixed()} Sec
                </span>
            </div>
        </div>
        <div
            class="flex-row rounded-lg border w-fit mx-auto mt-4 border-black dark:border-slate-100"
        >
            <button
                on:click={handleStartButtonClick}
                class="hover:dark:bg-white/10 p-2 w-12 border-r border-inherit"
            >
                <Icon data={playing ? pause : play} scale={2} />
            </button>
            <button
                on:click={() => jumpWords(-1)}
                class="hover:dark:bg-white/10 p-2 w-12"
            >
                <Icon data={chevronLeft} scale={2} />
            </button>
            <button
                on:click={() => jumpWords(1)}
                class="hover:dark:bg-white/10 border-r p-2 w-12 border-inherit"
            >
                <Icon data={chevronRight} scale={2} />
            </button>
            <button
                on:click={() => fontSize++}
                class="hover:dark:bg-white/10 p-2 w-12"
            >
                <Icon data={chevronUp} scale={2} />
            </button>
            <button
                on:click={() => fontSize--}
                class="hover:dark:bg-white/10 p-2 w-12 border-r border-inherit"
            >
                <Icon data={chevronDown} scale={2} />
            </button>
            <form class="inline-block">
                <label for="rollInput">roll size</label>
                <input
                    type="number"
                    id="rollInput"
                    name="rollInput"
                    min="1"
                    max="5"
                    class="bg-slate-100 dark:bg-slate-900 text-black dark:text-white"
                    bind:value={rollSize}
                />
                <!-- https://css-tricks.com/examples/MousewheelInputs/ -->
            </form>
        </div>
        <Slider
            step={rollSize}
            min={0}
            max={allWords.length - rollSize}
            bind:value={currentIdx}
        />
        <HighlightingTextArea
            on:txtUpdate={(e) => updateText(e.detail)}
            highlight={!playing}
            currentWord={currentIdx + rollSize - 1}
            splitText={allWords}
            bind:this={TextArea}
        />
    </div>
    <Dialog bind:showDialog>
        <div class="border-b-2 text-lg font-semibold text-left p-2">Help</div>
        <div class="p-2">
            <p>
                Use this
                <span>
                    <a href={bookmarklet} class="rounded bg-amber-300 px-1"
                        >Read this</a
                    >
                    Bookmarklet
                </span> to access rapid reader. When you have selected text on a
                website and click the bookmarklet it will be committed to the reader.
            </p>

            <p class="">
                You can use the arrow keys to change the speed and jump around.
                Using space you can start/pause.
            </p>
        </div>
    </Dialog>
</main>

<style>
    :root {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    }
</style>
