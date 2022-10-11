export function logout() {
    localStorage.clear();
    window.setTimeout(() => {
        location.href = "/";
    }, 100);
}