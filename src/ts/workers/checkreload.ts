export function checkReload() {
    if (location.href.includes("reload=true")) {
        location.href = location.href.replaceAll("?reload=true", "").replaceAll("&reload=true", "");
    }
}