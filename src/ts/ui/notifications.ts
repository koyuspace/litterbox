import $ from "jquery";
import { renderTimeline } from "./timeline";

const iconFav = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:star"><path fill="currentColor" d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"></path></svg>';
const iconBoost = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:arrow-repeat"><g fill="currentColor"><path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"></path><path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"></path></g></svg>';
const iconFollow = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:person-plus"><g fill="currentColor"><path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"></path><path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"></path></g></svg>';
const iconDelete = '<svg viewBox="0 0 16 16" astro-icon="bi:trash"><g fill="currentColor"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path></g></svg>';

export function renderNotifications(data) {
    let notifications = `<button onclick="location.href='/action/deletenotifications'" class="btn btn-danger" style="float:right;margin-right:8px;">${iconDelete}</button><br><br><br><ul>`;
    if (data.length === 0) {
        notifications += "<li>No notifications</li>";
    }
    data.forEach(element => {
        let display_name = element.account.display_name;
        if (element.account.emojis.length > 0) {
            element.account.emojis.forEach(dp_emoji => {
                display_name = display_name.replaceAll(`:${dp_emoji.shortcode}:`, `<img src="${dp_emoji.url}" alt="Emoji ${dp_emoji.shortcode}" class="emoji">`);
            });
        }
        switch (element.type) {
            case "follow":
                notifications += `<li>${iconFollow} <a href="/user?id=${element.account.id}"><img src="${element.account.avatar}" class="avatar" width="16" height="16" alt="${element.account.display_name}'s Avatar"></a> ${display_name} followed you</li>`;
                break;
            case "favourite":
                notifications += `<li>${iconFav} <a href="/user?id=${element.account.id}">${display_name}</a> favourited your post:<br>${renderTimeline([element.status], true, false)}</li>`;
                break;
            case "reblog":
                notifications += `<li>${iconBoost} <a href="/user?id=${element.account.id}">${display_name}</a> boosted your post:<br>${renderTimeline([element.status], true, false)}</li>`;
                break;
            case "mention":
                notifications += `<li>@ ${display_name} mentioned you:<br>${renderTimeline([element.status], true, false)}</li>`;
                break;
            case "poll":
                notifications += `<li>${display_name.split(" ")[0]}'s poll finished:<br>${renderTimeline([element.status], true, false)}</li>`;
                break;
            case "follow_request":
                notifications += `<li>${iconFollow} <a href="/follow_requests?id=${element.account.id}"><img src="${element.account.avatar}" class="avatar" width="16" height="16" alt="${element.account.display_name}'s Avatar"></a> ${display_name} wants to follow you</li>`;
                break;
            case "admin.sign_up":
                    notifications += `<li>${iconFollow} <a href="/user?id=${element.account.id}"><img src="${element.account.avatar}" class="avatar" width="16" height="16" alt="${element.account.display_name}'s Avatar"></a> ${display_name} signed up on your server</li>`;
                    break;
            case "update":
                notifications += `<li>${iconBoost} The post you boosted was updated<br>${renderTimeline([element.status])}</li>`
                break;
            case "status":
                notifications += `<li>${renderTimeline([element.status])}</li>`;
                break;
            default:
                notifications += "<li>Unkown notification type " + element.type + "</li>";
                break;
        }
    });
    notifications += "</ul>";
    $("#notifications").html(notifications);
}