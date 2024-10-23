import { checkForLogin } from "../auth/check";
import { checkInstance } from "../workers/landing";
import $ from "jquery";
checkForLogin();
$(document).ready(() => {
    if (checkInstance() !== "" && localStorage.getItem("token") === null) {
        $("input[name=\"instance\"]").val(checkInstance());
        window.setTimeout(() => {
            $("form").submit();
        }, 20);
    }
});