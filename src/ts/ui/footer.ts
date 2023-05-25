import $ from 'jquery';
import { api } from '../api/request';

api(localStorage.getItem('instance'), '/api/v1/instance', true, 'GET', {}, localStorage.getItem('token')).then((data) => {
    if (data.description.includes("%donate%")) {
        $("#donate-link").attr("href", data.description.split("%donate%")[1].split("\n")[0]);
    }
});