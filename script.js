// avi sir
// const API_KEY = "AIzaSyDI7xuxOTRzMaDfaecSlpFJfHOKQV04dnk"
// janu
// const API_KEY = "AIzaSyAleIvD7GbP2YXIcJyxkS8ZztIycWLmwCE"
const API_KEY = "AIzaSyDmfmgSetHDIZeO8dj1jDxdhvA03ojlMJQ"
const BASE_URL = "https://www.googleapis.com/youtube/v3"


const video_container = document.getElementById("video-container");

function showVideo(videos) {
    video_container.innerHTML = "";
    videos.map((video)=>{
        const thumbnail = video.snippet.thumbnails.high.url;
        const title = video.snippet.title;

        const div = document.createElement("div");
        div.className = "video-templet";
        div.innerHTML = `
            <a href="/video.html?videoId=${video.id.videoId}">
                <img src='${thumbnail}' alt="${title}"/>
                <div>
                    <p>${title}</p>
                </div>
            </a>
        `
        video_container.appendChild(div);
    })
}


function getVideo(query) {
    fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&type=video&q=${query}&maxResults=20&part=snippet`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            showVideo(data.items);
        })

}
getVideo("");


const input = document.getElementById("input");
const button = document.getElementById("btn");

button.addEventListener("click",()=>{
    const searchQuery = input.value;
    getVideo(searchQuery);
})

// input.addEventListener("input",(e)=>{
//     getVideo(e.target.value);
// }) 