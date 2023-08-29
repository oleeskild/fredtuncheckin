import { browser } from "$app/environment";
import {token} from "./store";

export async function validTokenOrRedirect(token: string|null): Promise<Boolean>{
    const loginResponse = await fetch(
        "https://oleeskild-fredtun-checkin.builtwithdark.com/validateToken",
        { method: "POST", body: JSON.stringify({ token }) }
    );
    if (loginResponse.ok) {
        return true;
    } else {
        if(browser){
            if(window.location.href !== "/login"){
                window.location.href = "/login";
            }
        }
    }
    return false;

}

export async function login(password: String | undefined): Promise<Boolean>{
    const loginResponse = await fetch(
        "https://oleeskild-fredtun-checkin.builtwithdark.com/login",
        { method: "POST", body: JSON.stringify({ password }) }
    );
    if (loginResponse.ok) {
        const tokenResponse = await loginResponse.text();
        const trimmedTokenResponse = tokenResponse.replace(/"/g, "");
        token.set(trimmedTokenResponse);
        return true;
    } 
    return false;

}