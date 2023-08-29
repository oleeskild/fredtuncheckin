<script>
    import { token } from "../store.js";
    import { browser } from "$app/environment";
    import { validTokenOrRedirect } from "../login";
    import { onMount } from "svelte";

    let name = "";
    let lastCheckdInName = "";
    let isRecentlyCheckedIn = false;

    onMount(async ()=>{
        if (browser) {
            await validTokenOrRedirect($token);
        }
    });


    /**
     * @type {number | undefined}
     */
    let timeout;
    let errorMessage = "";

    async function checkIn() {
        // Get geo location
        try {
            lastCheckdInName = name;
            const checkinResponse = await fetch(
                "https://oleeskild-fredtun-checkin.builtwithdark.com/checkin",
                {
                    method: "POST",
                    body: JSON.stringify({ name }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                        Authorization: `${$token} `,
                    }),
                }
            );
            if (checkinResponse.ok) {
                isRecentlyCheckedIn = true;
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    isRecentlyCheckedIn = false;
                }, 5000);
            } else {
                errorMessage = await checkinResponse.text();
                window.location.href = "/login";
            }
        } catch (err) {
            errorMessage = "Du må tillate lokasjonstjenester for å sjekke inn";
            return;
        }
    }
</script>

<div
    style="width: 500px; max-width: 90vw; display: flex; flex-direction: column;"
>
    {#if errorMessage}
        <div
            style="margin-bottom: 20px; font-size: 22px; color: #e28383; font-weight: 600;"
        >
            {errorMessage}
        </div>
    {/if}

    <form
        action=""
        method="get"
        style="width: 100%; display: flex; flex-direction:column"
    >
        <label
            style="width: 100%; font-size: 22px; text-align: start; font-weight:600"
        >
            Hva heter du?
            <input
                required
                style="margin-top: 10px; font-size: 32px; max-width: 85vw;"
                type="text"
                bind:value={name}
                placeholder="Skriv hele navnet ditt"
            />
        </label>
        <button
            type="submit"
            style="font-weight: 600; width: fit-content;"
            on:click={checkIn}>SJEKK INN</button
        >
    </form>

    {#if isRecentlyCheckedIn}
        <h2>Hei {lastCheckdInName} 😄</h2>
        <h3>Du er har blitt sjekket inn for idag 🎉</h3>
    {/if}
</div>
