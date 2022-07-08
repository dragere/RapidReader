<script>
    import { theme } from "../store";
    let containerClass = "";
    export {containerClass as class}
    export let disabled = false;
    export let step = 1;
    export let min = 0;
    export let max = 100;
    export let value = undefined;
</script>

<div id="container" class:dark={$theme === "dark"} class={"py-2 " + containerClass} >
    <input
        type="range"
        class="rs-range"
        {disabled}
        {step}
        {min}
        {max}
        bind:value
        on:blur
        on:focus
    />
</div>

<style>

    .rs-range {
        width: 100%;
        -webkit-appearance: none;
    }

    .rs-range:focus {
        outline: none;
    }
    .rs-range::-webkit-slider-runnable-track {
        /* width: 100%; */
        height: 1px;
        cursor: pointer;
        box-shadow: none;
        border-radius: 0px;
        border: 0px solid #f5f5f5;
        background-color: black;
    }

    .dark .rs-range::-webkit-slider-runnable-track {
        background-color: white;
        border: 0px solid #010101;
    }

    .rs-range::-moz-range-track {
        /* width: 100%; */
        height: 1px;
        cursor: pointer;
        box-shadow: none;
        border-radius: 0px;
        border: 0px solid #f5f5f5;
        background-color: black;
    }
    
    .dark .rs-range::-moz-range-track {
        background-color: white;
        border: 0px solid #010101;
    }

    .rs-range::-webkit-slider-thumb {
        box-shadow: none;
        border: 0px solid black;
        background: black;
        /* box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.25); */
        height: 14px;
        width: 14px;
        border-radius: 0px;
        transform: translate(0px, -6px) rotate(45deg);
        cursor: pointer;
        -webkit-appearance: none;
    }

    .dark .rs-range::-webkit-slider-thumb {
        border: 0px solid white;
        background: white;
    }

    .rs-range::-moz-range-thumb {
        box-shadow: none;
        border: 0px solid black;
        background: black;
        height: 42px;
        width: 22px;
        border-radius: 22px;
        cursor: pointer;
        -webkit-appearance: none;
        margin-top: -20px;
    }

    .dark .rs-range::-moz-range-thumb{
        border: 0px solid white;
        background: white;

    }

    .rs-range::-moz-focus-outer {
        border: 0;
    }
</style>
