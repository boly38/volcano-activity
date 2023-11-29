import dayjs from 'dayjs';

function notYetImplemented() {
    console.log("not yet implemented");
}

function home() {
    showPage('home')
}

function showPage(page, volcanoId = null, suggestId = null, liveId = null) {
    console.info("showPage", {page, volcanoId, suggestId, liveId})
    eventTrack(volcanoId ? `${page} ${volcanoId}` : page);
    document.body.dispatchEvent(new CustomEvent("showPage", {detail: {page, volcanoId, suggestId, liveId}}));
}

function suggestAdded(suggestId = null) {
    document.body.dispatchEvent(new CustomEvent("suggestAdded", {detail: {suggestId}}));
}

function suggestModerated() {
    document.body.dispatchEvent(new CustomEvent("suggestModerated", {detail: {}}));
}

function toggleSuggests() {
    document.body.dispatchEvent(new CustomEvent("toggleSuggests", {detail: {}}));
}

function retainToken(token = null) {
    document.body.dispatchEvent(new CustomEvent("retainToken", {detail: {token}}));
}

function isSet(v) {
    return v !== undefined && v !== null && v !== "";
}

/**
 * get current date format "yyyy-mm-dd" (ex. "2023-11-27")
 */
function nowDate() {
    return dayjs().format('YYYY-MM-DD');
}

function getEmbedUrlFrom(live) {
    const liveUrl = live.url
    const youtubeEmbed = getYoutubeEmbedUrl(liveUrl);
    if (youtubeEmbed !== null) {
        return youtubeEmbed;
    }
    const embedUrl = enrichEmbedUrl(live.embedUrl)
    if (isSet(embedUrl)) {
        return embedUrl;
    }
    return null;
}

function getYoutubeEmbedUrl(url) {// credit - Sobral, J W, zurfyx : https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
    if (!isSet(url)) {
        return null
    }
    let rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]+).*/;
    let r = url.match(rx);
    return r && r.length > 0 ? "https://www.youtube.com/embed/" + r[1] + "?enablejsapi=1" : null;
}

function enrichEmbedUrl(url) {
    if (!isSet(url)) {
        return null
    }
    let timestamp = new Date().getTime();
    let timestampSec = Math.round(timestamp / 1000);
    return url.replaceAll("TIMESTAMPSEC", timestampSec);
}

function getPendingRefusedVolcanoes(suggestEntries) {
    const volcanoesSuggests = suggestEntries ? Object.keys(suggestEntries)
        .map(k => suggestEntries[k]) : [];
    const pendingSuggestVolcanoes = volcanoesSuggests.filter(live => live.comment === undefined);
    const refusedSuggestVolcanoes = volcanoesSuggests.filter(live => live.comment !== undefined);
    return {pendingSuggestVolcanoes, refusedSuggestVolcanoes};
}

function getPendingRefusedLives(volcanoId, suggestEntries) {
    const liveSuggests = suggestEntries ? Object.keys(suggestEntries)
        .map(k => suggestEntries[k])
        .filter(live => volcanoId === null || live.volcano_id === volcanoId) : [];
    const pendingSuggestLives = liveSuggests.filter(live => live.comment === undefined);
    const refusedSuggestLives = liveSuggests.filter(live => live.comment !== undefined);
    return {pendingSuggestLives, refusedSuggestLives};
}

function eventTrack(eventName, eventProps) {
    window.umami && window.umami.track(eventName, eventProps);
}

export {
    notYetImplemented, home, showPage,
    suggestAdded, suggestModerated, toggleSuggests,
    retainToken, isSet, nowDate, getEmbedUrlFrom,
    getPendingRefusedVolcanoes, getPendingRefusedLives,
    eventTrack
};