const JSON_MEDIA = 'application/json';
const JSON_GET = { method: 'GET', headers: { 'Accept': JSON_MEDIA} };
// const JSON_HEADERS = { 'Accept': JSON_MEDIA, 'Content-Type': JSON_MEDIA };
// const JSON_POST = { method: 'POST', headers: JSON_HEADERS };
// const JSON_PUT =  { method: 'PUT', headers: JSON_HEADERS };
// const JSON_DELETE = { method: 'DELETE', headers: JSON_HEADERS };

export default class ApiV0 {
    static showPage(page, volcanoId = null) {
        document.body.dispatchEvent(new CustomEvent("showPage", {detail: {page, volcanoId}}));
    }

    static about()  {
        return ApiV0.simpleFetch("/about");
    }
    static volcanoes()  {
        return ApiV0.simpleFetch("/api/v0/volcanoes");
    }
    static simpleFetch(apiEndpoint) {
        return new Promise((resolve, reject) => {
            fetch(apiEndpoint, JSON_GET)
                .catch(reject)
                .then(response => response.json())
                .then(response => resolve(response));
        });
    }

    static isSet(v) {
        return v !== undefined && v !== null && v !== "";
    }
}