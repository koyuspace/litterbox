import { api } from "../api/request";
import { checkForLogin } from "../auth/check";
import { checkInstance } from "../workers/landing";
import $ from "jquery";
checkForLogin();
var instance = location.href.split("/")[2].split("/")[0].replace("web.", "");
if (instance === "localhost:3000") {
    instance = "localhost:8080";
}
$(document).ready(() => {
    if (checkInstance() !== "" && localStorage.getItem("token") === null) {
        $("input[name=\"instance\"]").val(checkInstance());
        window.setTimeout(() => {
            $("form").submit();
        }, 20);
    }
    const instance = location.href.split("/")[2].split("/")[0].replace("web.", "");
    $("#instance").val(instance);
    if (instance === "localhost:3000") {
        $("#instance").val("localhost:8080");
        api("localhost:8080", "/api/v1/instance").then((data) => {
            $(".logo").attr("src", data.thumbnail);
            $(".name").text(data.title);
            document.title = data.title;
            $(".description").html(data.description);
        });
    } else {
        api(instance, "/api/v1/instance").then((data) => {
                $(".logo").attr("src", data.thumbnail);
                $(".name").text(data.title);
                document.title = data.title;
                $(".description").html(data.description);
        });
    }
});