<script>
    import { get } from "svelte/store";

    let name = "";
    let isCheckedIn = false;
    let errorMessage = "";

    function toRadians(degrees) {
        return (degrees * Math.PI) / 180;
    }

    // Use the Haversine formula to calculate the distance between two coordinates in kilometers
    function haversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of Earth in kilometers

        lat1 = toRadians(lat1);
        lon1 = toRadians(lon1);
        lat2 = toRadians(lat2);
        lon2 = toRadians(lon2);

        const dlat = lat2 - lat1;
        const dlon = lon2 - lon1;

        const a =
            Math.sin(dlat / 2) * Math.sin(dlat / 2) +
            Math.cos(lat1) *
                Math.cos(lat2) *
                Math.sin(dlon / 2) *
                Math.sin(dlon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    const getCoords = async () => {
        // Get geo location

        const pos = await new Promise((resolve, reject) => {
            return navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
            });
        });

        return {
            long: pos.coords.longitude,
            lat: pos.coords.latitude,
        };
    };

    async function checkIn() {
        // Get geo location
        try {
            const coordinates = await getCoords();

            const fredtunLat = 59.1577701;
            const fredtunLong = 5.2953584;

            if (
                haversineDistance(
                    coordinates.lat,
                    coordinates.long,
                    fredtunLat,
                    fredtunLong
                ) > 1
            ) {
                errorMessage =
                    "Det ser ut til at du ikke befinner deg på Fredtun. Du må være på Fredtun for å sjekke inn.";
                return;
            }

            // const skudeLat = 59.1551409;
            // const skudeLong = 5.25712;

            // if(haversineDistance(coordinates.lat, coordinates.long, skudeLat, skudeLong) > 1) {
            //     errorMessage = "Du er ikke hjemme";
            //     return;
            // }

            const checkinResponse = await fetch(
                "https://oleeskild-fredtun-checkin.builtwithdark.com/checkin",
                { method: "POST", body: JSON.stringify({ name, coordinates }) }
            );
            if (checkinResponse.ok) {
                isCheckedIn = true;
            } else {
                errorMessage = await checkinResponse.text();
            }
        } catch (err) {
            errorMessage = "Du må tillate lokasjonstjenester for å sjekke inn";
            return;
        }
    }
</script>

<div
    style="width: 500px; max-width: 90vw; display: flex; align-items: center; flex-direction: column;"
>
    {#if errorMessage}
        <div
            style="margin-bottom: 20px; font-size: 22px; color: #e28383; font-weight: 600;">
            {errorMessage}
        </div>
    {/if}

    {#if isCheckedIn}
        <h2>Hei {name} 😄</h2>
        <h3>Du er nå sjekket inn for idag 🎉</h3>
    {:else}
        <form action="" method="get" style="width: 100%; display: flex; flex-direction:column">
            <label 
                    style="width: 100%; font-size: 22px; text-align: start; font-weight:600">
                Hva heter du?
                <input
                    required
                    style="margin-top: 10px; font-size: 32px; max-width: 85vw;"
                    type="text"
                    bind:value={name}
                    placeholder="Skriv hele navnet ditt"
                />
            </label>
        <button type="submit" style="font-weight: 600; width: fit-content;" on:click={checkIn}
            >SJEKK INN</button
        >
        </form>
    {/if}
</div>
