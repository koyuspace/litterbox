import $ from "jquery";
import { post, upload, loadPostForm } from "../workers/post";
loadPostForm();
$("#post").click(() => {
    post();
});
$("#upload").click(() => {
    upload();
});