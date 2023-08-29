import { writable } from "svelte/store";
import { browser } from "$app/environment";

const storedToken = browser ? localStorage.getItem("token") : null;
export const token = writable(storedToken);
token.subscribe(value => {
    if(!browser) return;
    localStorage?.setItem("token", value??"");
});