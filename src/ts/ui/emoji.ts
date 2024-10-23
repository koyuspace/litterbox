import $ from "jquery";
import { api } from "../api/request";

let images = $("#emoji img");

localStorage.setItem("wasemojipicker", "true");

api(localStorage.getItem("instance"), "/api/v1/custom_emojis", true, "GET", {}, localStorage.getItem("token")).then((data) => {
    $("#emoji").html("");
    if (data.length === 0) {
        $("#emoji").html("<div class='alert' style='text-align:center;'>(╯°□°）╯︵ ┻━┻<br>Y U NO EMOJO</div>");
        $("#search").hide();
    }
    data.forEach((emoji) => {
        if (emoji.visible_in_picker) {
            $("#emoji").append("<img src='" + emoji.url + "' title=':"+emoji.shortcode+": (Click to copy)' alt=':" + emoji.shortcode + ":' title='" + emoji.shortcode + "' class='emoji' data-bs-dismiss='modal' />");
            images = $("#emoji img");
        }
    });
});

$("#search").on("input",function() {
  images.hide();
  const val = this.value.trim().toLowerCase();  
  if (val === "") return; 
  images.filter(function() {return this.alt.toLowerCase().replaceAll("_", "").includes(val)  }).show();
});

$("#search").on("keyup",() => {
    if ($("#search").val() === "") {
        images.show();
    }
});

window.setTimeout(() => {
    $(".emoji").hover(function(){
        $(this).css("transform", "scale(2, 2)");
     }, function(){
        $(this).css("transform", "none");
     });
     $(".emoji").click(function(){
        var emoji = $(this).attr("alt");
        navigator.clipboard.writeText(emoji);
        let leer = " ";
        if ($("#post-form").val().length === 0) {
            leer = "";
        }
        $("#post-form").val($("#post-form").val() + leer + emoji);
     });
}, 1000);