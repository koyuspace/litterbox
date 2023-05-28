import $ from "jquery";
import { post, upload, loadPostForm } from "../workers/post";
loadPostForm();
$("#post").click(() => {
    upload();
    post();
});
$("#upload").click(() => {
    let alt = prompt("Add a description for your file:");
    if (alt && alt != "") {
        upload(alt);
    } else {
        upload();
    }
});