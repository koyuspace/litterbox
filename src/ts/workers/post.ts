import $ from "jquery";
import { api } from "../api/request";
import{ renderTimeline } from "../ui/timeline";

let uploads = [];

// Sorry I couldn't come up with a better function name ~koyu
function manageLocalStorageOnPostForm(id, storage) {
    try {
        if (localStorage.getItem(storage) !== null && localStorage.getItem(storage) !== "") {
            $(`#${id}`).val(localStorage.getItem(storage));
            window.setInterval(() => {
                localStorage.setItem(storage, "");
            }, 1000);
        }
    } catch (e) {
        localStorage.setItem(storage, "");
    }
}

function returnAllUrls(text) {
    let urls = [];
    let words = text.replaceAll("\n", " ").split(" ");
    words.forEach((e) => {
        if (e.startsWith("http://") || e.startsWith("https://")) {
            urls.push(e);
        }
    });
    return urls;
}

export function loadPostForm() {
    try {
        if (localStorage.getItem("content") !== null && localStorage.getItem("content") !== "") {
            $("#post-form").val(localStorage.getItem("content"));
            window.setInterval(() => {
                localStorage.setItem("content", "");
            }, 1000);
        }
    } catch (e) {
        localStorage.setItem("content", "");
    }
    manageLocalStorageOnPostForm("post-form", "content");
    manageLocalStorageOnPostForm("spoiler", "spoiler_text");
    manageLocalStorageOnPostForm("visibility", "visibility");
    const id = location.href.split("?id=")[1];
    if (localStorage.getItem("media_ids") !== "[]" && localStorage.getItem("media_ids") !== null) {
        uploads = JSON.parse(localStorage.getItem("media_ids"));
        localStorage.setItem("uploads", JSON.stringify(uploads));
        localStorage.setItem("media_ids", "[]");
        uploads.forEach((e) => {
            api(localStorage.getItem("instance"), `/api/v1/media/${e}`, true, "GET", {}, localStorage.getItem("token"), true).then((data) => {
                const attachment = data;
                if (attachment.type === "image") {
                    $("#media_attachments").append(`<img src="${attachment.url}" id="file-${data.id}" class="attachment" width="300"> `);
                }
                if (attachment.type === "video") {
                    $("#media_attachments").append(`<img src="${attachment.preview_url}" id="file-${data.id}" class="attachment" width="300"> `);
                }
                if (attachment.type === "audio") {
                    $("#media_attachments").append(`<audio src=${attachment.url} id="file-${data.id}" class="attachment" preload controls></audio> `);
                }
                if (attachment.type === "gifv") {
                    $("#media_attachments").append(`<video src=${attachment.url} id="file-${data.id}" width="300" class="attachment" autoplay muted loop></video> `);
                }
                $(`#file-${data.id}`).click(() => {
                    const id = $(`#file-${data.id}`).attr("id").replace("file-", "");
                    let tmp = [];
                    uploads.forEach((e) => {
                        if (e !== id) {
                            tmp.push(e);
                        }
                    });
                    uploads = tmp;
                    localStorage.setItem("uploads", JSON.stringify(uploads));
                    $(`#file-${data.id}`).hide();
                });
            });
        });
    }
    if (id === undefined) {
        if (localStorage.getItem("visibility") === null || localStorage.getItem("visibility") === "") {
            api(localStorage.getItem("instance"), "/api/v1/accounts/verify_credentials", true, "GET", {}, localStorage.getItem("token")).then((data) => {
                $(`#${data.source.privacy}`).attr("selected", "");
            });
        }
    }
    if (id !== undefined) {
        api(localStorage.getItem("instance"), `/api/v1/statuses/${id}`, true, "GET", {}, localStorage.getItem("token")).then((data) => {
            if (data.reblog) {
                $(`#${data.reblog.visibility}`).attr("selected", "");
                if (data.reblog.account.id !== localStorage.getItem("userid") && localStorage.getItem("content") === "") {
                    $("#post-form").val(`@${data.reblog.account.acct} `);
                }
            } else {
                $(`#${data.visibility}`).attr("selected", "");
                if (data.account.id !== localStorage.getItem("userid") && localStorage.getItem("content") === "") {
                    $("#post-form").val(`@${data.account.acct} `);
                }
            }
            $("#post-form").focus();
            $("#context").html(renderTimeline([data]));
        });
    }
}

export function post() {
    var input: any = document.getElementById("file");
    var file_data = input.files[0];
    let form_data = new FormData();
    form_data.append("file", file_data);
    api(localStorage.getItem("instance"), "/api/v1/media", true, "POST", form_data, localStorage.getItem("token"), true).then((data) => {
        uploads.push(data.id);
        localStorage.setItem("uploads", JSON.stringify(uploads));
        $("#file").val("");
        $("#media_attachments").append(`<img src="${data.url}" class="file" id="file-${data.id}" height="90">`);
        $(`#file-${data.id}`).click(() => {
            const id = $(`#file-${data.id}`).attr("id").replace("file-", "");
            let tmp = [];
            uploads.forEach((e) => {
                if (e !== id) {
                    tmp.push(e);
                }
            });
            uploads = tmp;
            localStorage.setItem("uploads", JSON.stringify(uploads));
            $(`#file-${data.id}`).hide();
        });
    }).then(() => {
        let id = location.href.split("?id=")[1];
        if (id === undefined) {
            id = "";
        }
        api(localStorage.getItem("instance"), "/api/v1/statuses", true, "POST", {
            "status": $("#post-form").val(),
            "media_ids": uploads,
            "poll": [],
            "visibility": $("#visibility").val(),
            "spoiler_text": $("#spoiler").val(),
            "in_reply_to_id": id,
            "sensitive": $("#spoiler").val() !== ""
        }, localStorage.getItem("token")).then((data) => {
            $("#post-form").val("");
            localStorage.setItem("content", "");
            localStorage.setItem("spoiler_text", "");
            localStorage.setItem("media_ids", "[]");
            localStorage.setItem("uploads", "[]");
            window.setTimeout(() => {
                location.href = `/thread?id=${data.id}`;
            }, 500);
        });
    }).catch(() => {
        let id = location.href.split("?id=")[1];
        if (id === undefined) {
            id = "";
        }
        api(localStorage.getItem("instance"), "/api/v1/statuses", true, "POST", {
            "status": $("#post-form").val(),
            "media_ids": uploads,
            "poll": [],
            "visibility": $("#visibility").val(),
            "spoiler_text": $("#spoiler").val(),
            "in_reply_to_id": id,
            "sensitive": $("#spoiler").val() !== ""
        }, localStorage.getItem("token")).then((data) => {
            $("#post-form").val("");
            localStorage.setItem("content", "");
            localStorage.setItem("spoiler_text", "");
            localStorage.setItem("media_ids", "[]");
            localStorage.setItem("uploads", "[]");
            window.setTimeout(() => {
                location.href = `/thread?id=${data.id}`;
            }, 500);
        });
    });
}

export function upload() {
    var input: any = document.getElementById("file");
    var file_data = input.files[0];
    let form_data = new FormData();
    form_data.append("file", file_data);
    $("#file").attr("disabled", "");
    $("#upload").attr("disabled", "");
    api(localStorage.getItem("instance"), "/api/v1/media", true, "POST", form_data, localStorage.getItem("token"), true).then((data) => {
        const attachment = data;
        uploads.push(data.id);
        localStorage.setItem("uploads", JSON.stringify(uploads));
        $("#file").val("");
        if (attachment.type === "image") {
            $("#media_attachments").append(`<img src="${attachment.url}" id="file-${data.id}" class="attachment" width="300"> `);
        }
        if (attachment.type === "video") {
            $("#media_attachments").append(`<img src="${attachment.preview_url}" id="file-${data.id}" class="attachment" width="300"> `);
        }
        if (attachment.type === "audio") {
            $("#media_attachments").append(`<audio src=${attachment.url} id="file-${data.id}" class="attachment" preload controls></audio> `);
        }
        if (attachment.type === "gifv") {
            $("#media_attachments").append(`<video src=${attachment.url} id="file-${data.id}" width="300" class="attachment" autoplay muted loop></video> `);
        }
        $("#file").removeAttr("disabled");
        $("#upload").removeAttr("disabled");
        $(`#file-${data.id}`).click(() => {
            const id = $(`#file-${data.id}`).attr("id").replace("file-", "");
            let tmp = [];
            uploads.forEach((e) => {
                if (e !== id) {
                    tmp.push(e);
                }
            });
            uploads = tmp;
            localStorage.setItem("uploads", JSON.stringify(uploads));
            $(`#file-${data.id}`).hide();
        });
    });
}

api(localStorage.getItem("instance"), "/api/v1/instance", true, "GET", {}, localStorage.getItem("token")).then((data) => {
    $("#post-form").on("input", async () => {
        let maxlength =  500;
        if (data.max_toot_chars !== null) {
            maxlength = data.max_toot_chars;
        }
        let currlength = $("#post-form").val().length;
        await returnAllUrls($("#post-form").val()).forEach((e) => {
            currlength -= e.length;
            currlength += 23;
        })
        $("#counter").html(`${currlength}/${maxlength}`);
        if (currlength.length > maxlength) {
            $("#post").attr("disabled", "");
            $("#counter").css("color", "red");
        } else {
            $("#post").removeAttr("disabled");
            $("#counter").css("color", "white");
        }
    });
});
