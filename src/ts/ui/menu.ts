import $ from "jquery";

const domain = location.href.split("/")[2];
let protocol = "https://";

if (domain.startsWith("localhost")) {
    protocol = "http://";
}

let page = location.href.replace(protocol+domain+"/", "").replaceAll("/", "--").split("?")[0];

$(`#nav-${page.replaceAll("#", "")}`).attr("class", "nav-link active");