// const API_KEY = "AIzaSyAleIvD7GbP2YXIcJyxkS8ZztIycWLmwCE"
// const API_KEY = "AIzaSyDI7xuxOTRzMaDfaecSlpFJfHOKQV04dnk"
const API_KEY = "AIzaSyDmfmgSetHDIZeO8dj1jDxdhvA03ojlMJQ"
const BASE_URL = "https://www.googleapis.com/youtube/v3"

window.addEventListener("load", () => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const videoId = params.get('videoId');

    if (videoId) {
        loadVideo(videoId);
        getVideoDetails(videoId);
        loadComment(videoId);
    }
    else {
        console.log("No video ID found in URL");
    }
})

console.log("youtube",YT);

function loadVideo(videoId) {
    if (YT) {
        new YT.Player('video-container', {
            height: "500",
            width: "1000",
            videoId: videoId
        });
    }
}

async function getVideoDetails(videoId) {
    try {
        const response = await fetch(`${BASE_URL}/videos?key=${API_KEY}&part=snippet&part=statistics&id=${videoId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log(response);
        const data = await response.json();
        console.log("details", data);
        displayVideoDetails(data);
        getChannelDetails(data.items[0].snippet.channelId,videoId);
    }
    catch (error) {
        console.log("Error in fetching video details ", error);
    }
}

async function getChannelDetails(channelId,videoId) {
    try {
        const response = await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=snippet&part=statistics&id=${channelId}`)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json();
        console.log("channel info", data);
        displayChannelInfo(data,channelId,videoId);
        loadRecommendedVideo(data.items[0].snippet.title);
    } catch (error) {
        console.log("Error in fetching Channel details ", error);
    }
}

async function loadComment(videoId) {
    try {
        const response = await fetch(`${BASE_URL}/commentThreads?key=${API_KEY}&part=snippet&videoId=${videoId}&maxResults=25`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json();
        console.log("comment", data);
        displayComment(data.items);
        
    } catch (error) {
        console.log("Error in loading comment", error);
    }
}

async function loadRecommendedVideo(channelName) {

    try {
        const res = await fetch(`${BASE_URL}/search?key=${API_KEY}&part=snippet&q=${channelName}&type=video&maxResults=20`)
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data = await res.json()
        console.log("recoomend",data);
        displayRecommendeVideo(data.items)
        
    } catch (error) {
        console.log("Error in loading recommended video", error);
    }
}

function displayVideoDetails(details) {
    const video_details = document.getElementById("video-details");

    const title = document.createElement("div");
    title.innerHTML = `
        <h4 class="video-title">${details.items[0].snippet.title}</h4>
    `
    video_details.appendChild(title);


    let like = details.items[0].statistics.viewCount;
    console.log(like / like);
    const stat = document.createElement("div");
    stat.className = "video";
    stat.innerHTML = `
        <div class="left-part-video-details">
            <p>${details.items[0].statistics.viewCount} views</p>
            <p>. ${details.items[0].snippet.publishedAt}</p>
        </div>
        <div class="right-part-video-details">
            <a href="#" id="like">${details.items[0].statistics.likeCount} like</a>
            <a href="#" id="dislike">dislike</a>
            <a href="#" id="share">SHARE</a>
            <a href="#" id="save">SAVE</a>
            <a href="#" id="more">...</a>
        </div>
    `
    video_details.appendChild(stat);
}

function displayChannelInfo(details,channelId,videoId) {
    const channleInfo = document.getElementById("channel-info");
    // console.log("display channel id",channelId,"video Id",videoId);
    const channelLogo = document.createElement("div")
    channelLogo.className = "logo"
    channelLogo.innerHTML = `
    <a href="/channel.html?videoId=${videoId}&channelId=${channelId}">
        <img src="${details.items[0].snippet.thumbnails.default.url}" alt="${details.items[0].snippet.title}">
    </a>
    `
    const info = document.createElement("div")
    info.className = "about-channel"
    info.innerHTML = `
            <div class="name-btn">
                <div class="name-subscribe">
                    <p>${details.items[0].snippet.title}</p>
                    <p id="subs">${details.items[0].statistics.subscriberCount} subscribers</p>
                </div>
                <button id="btn">Subscribe</button>
            </div>
            <div class="discription">
                ${details.items[0].snippet.description}
            </div>
    `
    channleInfo.appendChild(channelLogo)
    channleInfo.appendChild(info)
}

function displayComment(details) {
    const comment_container = document.getElementById("comment-container")
    details.forEach((comment) => {
        const div = document.createElement("div")
        div.className = "comment";
        div.innerHTML = `
            <img src="${comment.snippet.topLevelComment.snippet.authorProfileImageUrl}"/>
            <div class="text-container">
                <div class="upper">
                    <p>${comment.snippet.topLevelComment.snippet.authorDisplayName}</p>
                    <p>${comment.snippet.topLevelComment.snippet.textOriginal}</p>
                </div>
                <div class="lower">
                    <p>${comment.snippet.topLevelComment.snippet.likeCount}</p>
                    <p>dislike</p>
                    <p>REPLY</p>
                </div>
            </div>
        `
        comment_container.appendChild(div)
    })
}

function displayRecommendeVideo(recommendedVideo) {
    console.log("display recomend",recommendedVideo);
    const container = document.getElementById("recomended-video");
    container.innerHTML = "";
    recommendedVideo.map((video) => {
        const channelname = video.snippet.channelTitle;
        const publishTime = video.snippet.publishedAt;
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        const thumbnail = video.snippet.thumbnails.medium.url;
        const videoCard = document.createElement("div");
        videoCard.className = "recommended";
        videoCard.innerHTML = `
            <a href="./video.html?videoId=${videoId}" class="recommended-video">
                <img src="${thumbnail}" alt="${title}">
                <div>
                    <p>${title}</p>
                    <div class="channel-name">
                        <p>${channelname}</p>
                        <p>${publishTime}</p>
                    </div>
                </div>
            </a>
        `
        container.appendChild(videoCard);
    })
}


// search functionalities
const input = document.getElementById("input");
const button = document.getElementById("btn")

button.addEventListener("click",()=>{
    const searchQuery = input.value;
    console.log(searchQuery);
    loadRecommendedVideo(searchQuery);
})