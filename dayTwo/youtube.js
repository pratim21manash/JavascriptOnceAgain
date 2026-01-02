//YouTube Channel Stats – Most Viewed Video
const videos = [
  { title: "JS Basics", views: 12000 },
  { title: "React Hooks", views: 45000 },
  { title: "Node APIs", views: 28000 }
];

//Find the most viewed video.
let topVideo = videos[0];

for (let video of videos) {
  if (video.views > topVideo.views) {
    topVideo = video;
  }
}

console.log(topVideo);


//using reduce method
const topVideoo = videos.reduce((max, video) =>
  video.views > max.views ? video : max
);

console.log(topVideo);
