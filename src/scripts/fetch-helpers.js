import Cookies from 'js-cookie';

export async function fetchGet(url) {
    return fetch(url, {credentials: 'same-origin'});
}

export async function fetchPost(url, postBody) {
    let csrftoken = Cookies.get('csrftoken');
    let reqHeaders = new Headers();
    if (csrftoken !== undefined) {
        reqHeaders.append('X-CSRFToken', csrftoken);
    }
    console.log(csrftoken, reqHeaders);
    return fetch(
        url,
        {
            method: 'POST',
            body: postBody,
            credentials: 'same-origin',
            headers: reqHeaders
        }
    );
}
