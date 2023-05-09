import $ from "jquery";
import { api } from "../api/request";


api(localStorage.getItem("instance"), "/api/v1/custom_emojis", true, "GET", {}, localStorage.getItem("token")).then((data) => {
    $("#emoji").html("");
    data.forEach((emoji) => {
        if (emoji.visible_in_picker) {
            $("#emoji").append("<img src='" + emoji.url + "' title=':"+emoji.shortcode+": (Click to copy)' alt=':" + emoji.shortcode + ":' title='" + emoji.shortcode + "' class='emoji' />");
        }
    });
});

window.setInterval(() => {
    $(".emoji").hover(function(){
        $(this).css("transform", "scale(2, 2)");
     }, function(){
        $(this).css("transform", "none");
     });
     $(".emoji").click(function(){
        var emoji = $(this).attr("alt");
        navigator.clipboard.writeText(emoji);
     });
}, 1000);