export function goBack() {
    switch (localStorage.getItem("currentpage")) {
        case "user":
            location.href = "/user?id="+localStorage.getItem("lastuser");
            break;
        case "search":
            location.href = "/search?id="+localStorage.getItem("lastsearch");
            break;
        case "notifications":
            location.href = "/notifications";
            break;
        case "follow_requests":
            location.href = "/follow_requests";
            break;
        default:
            location.href = "/timeline/"+localStorage.getItem("currentpage");
            break;
    }
}