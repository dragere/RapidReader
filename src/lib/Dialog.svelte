<script>
    import {fade} from 'svelte/transition';

    export let showDialog = false;
</script>
{#if showDialog}
    <div on:click={() => showDialog = false} on:keyup={e => (e.code === "Space") ? showDialog = false : 0} transition:fade="{{duration: 150}}"
         class="modal fade fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden backdrop-blur-sm bg-black/50 overflow-y-auto"
         tabindex="-1" role="button">
        <div class="modal-dialog relative w-auto max-w-screen-sm pointer-events-none top-5 ml-auto mr-auto">
            <div class="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white dark:bg-slate-900 bg-clip-padding rounded-md outline-none text-current">
                <slot></slot>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal {
        z-index: 1055;
    }

    .fade {
        transition: opacity .15s linear;
    }
</style>
