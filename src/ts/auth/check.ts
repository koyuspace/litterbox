export function checkLogin() {
    if (localStorage.getItem("token") === null) {
        location.href = "/start";
    } else {
        location.href = "/timeline/home";
    }
}

export function checkForLogin() {
    if (localStorage.getItem("token") !== null) {
        location.href = "/timeline/home";
    }
}