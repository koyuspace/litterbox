export function checkLogin() {
    if (localStorage.getItem("token") === null) {
        location.href = "/start"
    } else {
        location.href = "/home"
    }
}