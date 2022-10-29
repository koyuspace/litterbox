import $ from "jquery";
import { post, upload, loadPostForm } from "../workers/post";
loadPostForm();
$("#post").click(() => {
    upload();
    post();
});
$("#upload").click(() => {
    upload();
});