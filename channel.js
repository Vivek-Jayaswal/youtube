// const API_KEY = "AIzaSyAleIvD7GbP2YXIcJyxkS8ZztIycWLmwCE"
// const API_KEY = "AIzaSyDI7xuxOTRzMaDfaecSlpFJfHOKQV04dnk"
const API_KEY = "AIzaSyDmfmgSetHDIZeO8dj1jDxdhvA03ojlMJQ"
const BASE_URL = "https://www.googleapis.com/youtube/v3"


window.addEventListener("load", () => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const videoId = params.get('videoId');
    const channelId = params.get('videoId');
    console.log(videoId, channelId);

    if (videoId) {
        getVideoDetails(videoId)
    }
    else {
        console.log("No video ID found in URL");
    }
})

async function getVideoDetails(videoId) {
    try {
        const response = await fetch(`${BASE_URL}/videos?key=${API_KEY}&part=snippet&part=statistics&id=${videoId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("details", data);
        getChannelInfo(data.items[0].snippet.channelId)
        displayVideoDetails(data.items[0]);

    }
    catch (error) {
        console.log("Error in fetching video details ", error);
    }
}

function displayVideoDetails(details) {
    const container = document.getElementById("container");
    const div = document.createElement("div");
    div.className = "video-info"
    div.innerHTML = `
    <img src="${details.snippet.thumbnails.medium.url}" alt="details.snippet.title">
    <div id="text-content">
        <h2>${details.snippet.title}</h2>
        <div>
            <span>${details.statistics.viewCount}</span>
            <span>${details.snippet.publishedAt}</span>
        </div>
        <p id="description" class="des">${details.snippet.localized.description}</p>
        <button class="btn">Show More</button>
    </div>
    `
    container.appendChild(div);

        const description = document.getElementById("description");
        const button = document.querySelector(".btn");
        const maxHeight = 100;
        if (description.offsetHeight>maxHeight) {
            description.classList.add("hide-some-content");
            button.classList.contains("btn");
            button.classList.remove("btn")
            button.classList.add("btn-show")
        }
        else{
            description.classList.remove("hide-some-content")
        }
    
        button.addEventListener("click",()=>{
            if (description.classList.contains("hide-some-content")) {
                description.classList.remove("hide-some-content");
                button.textContent = "Show less"
            }
            else{
                description.classList.add("hide-some-content");
                button.textContent = "Show More"
            }
        })
}

async function getChannelInfo(channelId) {
    const response = await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=snippet&part=statistics&id=${channelId}`)
    const data = await response.json();
    console.log("dt",data);
    displayChannleDetails(data.items[0]);
    getOtherVideoDetails(data.items[0].snippet.localized.title)
}

function displayChannleDetails(details) {
    
    console.log(details);
    const container = document.getElementById("channle-information")
    container.innerHTML = `
        <img src="${details.snippet.thumbnails.medium.url}" alt="">
        <div class="info">
            <div>
                <p>${details.snippet.localized.title}</p>
                <p>${details.statistics.subscriberCount} subscribes</p>
            </div>
            <button id="subscribe-btn">Subscribes</button>
        </div>
    `
}

async function getOtherVideoDetails(tags) {
    const response = await fetch(`${BASE_URL}/search?key=${API_KEY}&part=snippet&q=${tags}&type=video&maxResults=10`)
    const data = await response.json();

    console.log(data);
    displayOtherVideos(data.items)
}   

function displayOtherVideos(videos) {
    console.log(videos);
    const container = document.getElementById("video-container");
    videos.map((video)=>{
        const div = document.createElement("div")
        div.className = "video"
        div.innerHTML = `
            <img src="${video.snippet.thumbnails.medium.url}" alt="">
            <p>${video.snippet.title}</p>
        `
        container.appendChild(div);
    })
}