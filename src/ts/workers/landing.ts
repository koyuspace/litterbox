export function checkInstance() {
    if (location.href.includes("?instance=")) {
        return location.href.split("?instance=")[1];
    } else {
        return "";
    }
}