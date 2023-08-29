<script>
    import { onMount } from "svelte";
    import { token } from "../../store";
    import { validTokenOrRedirect } from "../../login";
    /**
     * @type {any[]}
     */
    let checkins = [];

    function humanDate(date) {
        const d = new Date(date);
        return `${d.getDate()}.${
            d.getMonth() + 1
        }.${d.getFullYear()}`;
    }

    onMount(async () => {
        await validTokenOrRedirect($token);

        const response = await fetch(
            "https://oleeskild-fredtun-checkin.builtwithdark.com/checkins",
            {
                headers: new Headers({
                    "Content-Type": "application/json",
                    Authorization: `${$token} `,
                }),
            }
        );
        checkins = await response.json();
    });

    function tableToCSV(table) {
        const rows = Array.from(table.querySelectorAll("tr"));
        return rows
            .map((row) => {
                const columns = Array.from(row.querySelectorAll("td, th"));
                return columns
                    .map((column) => '"' + column.innerText + '"')
                    .join(",");
            })
            .join("\n");
    }

    function downloadCSVAsExcel(csv, filename) {
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = filename;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function exportTableToExcel(tableId, filename = "output.xlsx") {
        const table = document.getElementById(tableId);
        const csv = tableToCSV(table);
        downloadCSVAsExcel(csv, filename);
    }
</script>

<button style="width: 100%;" on:click={() => exportTableToExcel("checkins", "checkins.csv")}>
    Last ned som Excel
    </button>

<table style="font-size: 28px" id="checkins">
    <thead>
        <tr>
            <th>Navn</th>
            <th>Sjekket inn</th>
        </tr>
    </thead>
    <tbody>
        {#each checkins as person}
            <tr>
                <td>{person.name}</td>
                <td>{humanDate(person.date)}</td>
            </tr>
        {/each}
    </tbody>
</table>
