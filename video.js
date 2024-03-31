const API_KEY = "AIzaSyAleIvD7GbP2YXIcJyxkS8ZztIycWLmwCE"
const BASE_URL = "https://www.googleapis.com/youtube/v3"

window.addEventListener("load",()=>{
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const videoId = params.get('videoId');

    if (videoId) {
        loadVideo(videoId);
        getVideoDetails(videoId);
        loadComment(videoId);
    }
    else{
        console.log("No video ID found in URL");  
    }
})

function loadVideo(videoId) {
    if (YT) {
        new YT.Player('video-container', {
            height: "500",
            width: "800",
            videoId: videoId
        });
    }
}

async function getVideoDetails(videoId) {
    const response = await fetch(`${BASE_URL}/videos?key=${API_KEY}&part=snippet&part=statistics&id=${videoId}`);
    const data = await response.json();
    console.log("details",data);
    displayVideoDetails(data);
    getChannelDetails(data.items[0].snippet.channelId);
}

async function getChannelDetails(channelId) {
    const response = await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=snippet&part=statistics&id=${channelId}`)
    const data = await response.json();
    console.log("channel info",data);
    displayChannelInfo(data);
}

async function loadComment(videoId) {
    const response = await fetch(`${BASE_URL}/commentThreads?key=${API_KEY}&part=snippet&videoId=${videoId}&maxResults=25`);
    const data = await response.json();
    console.log("comment",data);
    displayComment(data.items);
} 

function displayVideoDetails(details) {
    const video_details = document.getElementById("video-details");

    const title = document.createElement("div");
    title.innerHTML = `
        <h4 class="video-title">${details.items[0].snippet.title}</h4>
    `
    video_details.appendChild(title);


    let like = details.items[0].statistics.viewCount;
    console.log(like/like);
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

function displayChannelInfo(details) {
    const channleInfo = document.getElementById("channel-info");

    const channelLogo = document.createElement("div") 
    channelLogo.className = "logo"
    channelLogo.innerHTML = `
    <img src="${details.items[0].snippet.thumbnails.default.url}" alt="${details.items[0].snippet.title}">
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