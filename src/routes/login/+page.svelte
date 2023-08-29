<script>
    import { login } from "../../login";
    import { token } from "../../store";

    let password = "";
    let errorMessage = "";

    async function submitPassword() {
        errorMessage = "";
        const isSuccessful = await login(password);
        if(isSuccessful) {
            window.location.href = "/";
        } else {
            errorMessage = "Feil passord";
        }
    }
</script>

<div>
    <form on:submit|preventDefault={submitPassword}>
        <div
            style="display: flex; justify-content: center; align-items: center; flex-direction: column; margin-top: 50px;"
        >
            <label style="width: 100%;">
                <h3>Passord</h3>
                <input
                    style="width: 100%;"
                    type="password"
                    name="password"
                    bind:value={password}
                />
            </label>
            <button style="padding: 10px 50px;" type="submit">LOGG INN</button>
        </div>
    </form>


    <h1 style="color: red;">
        {errorMessage}
    </h1>
</div>
