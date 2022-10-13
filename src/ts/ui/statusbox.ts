import $ from "jquery";
import { post, loadPostForm } from "../workers/post";
loadPostForm();
$("#post").click(() => {
    post();
});