import $ from "jquery";

export function renderProfileCards(data) {
    let html = "";
    const id = location.href.split("?id=")[1];
    data.forEach(element => {
        let display_name = element.display_name;
        if (element.emojis.length > 0) {
            element.emojis.forEach(dp_emoji => {
                display_name = display_name.replaceAll(`:${dp_emoji.shortcode}:`, `<img src="${dp_emoji.url}" alt=":${dp_emoji.shortcode}:" class="emoji">`);
            });
        }
        html += `<style>#pc-${element.id} { background: linear-gradient(rgba(0,0,0,.75), rgba(0,0,0,.75)), url('${element.header}') center center no-repeat; background-size: cover; }</style>`;
        html += `<div class="user-card" id="pc-${element.id}">`;
        html += `<p><h1><a href="/user?id=${element.id}"><img src="${element.avatar}" class="avatar" width="64" height="64" alt="${element.display_name}'s Avatar"></a> ${display_name}</h1>`
        html += `<p style="font-size:8pt;">@${element.acct}</p></div><br>`;
        $(document).ready(() => {
            if (id !== undefined) {
                if (element.id !== id) {
                    $("#fr-"+element.id).hide();
                }
            }
        });
    });
    return html;
}