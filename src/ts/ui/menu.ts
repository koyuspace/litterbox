import $ from "jquery";

const domain = location.href.split("/")[2];
let protocol = "https://";

if (domain.startsWith("localhost")) {
    protocol = "http://";
}

let page = location.href.replace(protocol+domain+"/", "").split("?")[0];

$(`#nav-${page}`).attr("class", "nav-link active");