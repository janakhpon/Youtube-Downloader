// Imports/Requirements and Variable Assignments
const remote = require("electron").remote;
const { app } = require("electron").remote;

const ById = function(id) {
  return document.getElementById(id);
};

//GET PATH

const path = require("path");
const readline = require("readline");
//ASSIGN RESPECTIVE IDS

let video = ById("video"),
  audio = ById("audio"),
  view = ById("view"),
  power = ById("power"),
  backward = ById("backward"),
  forward = ById("forward"),
  progress1 = ById("progress1"),
  progress2 = ById("progress2"),
  progress3 = ById("progress3"),
  progress4 = ById("progress4"),
  status = ById("statuschange"),
  status1 = ById("statuschange1");

var fs = require("fs"),
  ytdl = require("ytdl-core"),
  ffmpeg = require("fluent-ffmpeg");

var msgstart = "started downloading now ...",
  msgfinished = "downloaded files successfully",
  msgvdownloading = "video downloading ....",
  msgadownloading = "audio downloading ....",
  msgdefault = " * * * * * * * * ",
  msgnormal = "no progress is available";

status.value = msgnormal;
status1.value = msgdefault;

//GET VIDEO MAIN FUNCTION

function downVideo() {
  let name = view.getTitle();
  const url = view.getURL();

  const output = path.resolve(
    `${app.getPath("home")}/Downloads/`,
    `${name}` + ".mp4"
  );
  const video = ytdl(url);
  let starttime;
  status1.value = msgvdownloading;

  video.pipe(fs.createWriteStream(output));
  video.once("response", () => {
    starttime = Date.now();
  });

  video.on("progress", (chunkLength, downloaded, total) => {
    status.value = msgstart;

    const floatDownloaded = downloaded / total;
    const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;

    var progress1v = "Progress : " + (floatDownloaded * 100).toFixed(2) + "%";
    progress1.value = progress1v;

    var progress2v =
      "Downloaded : " +
      (downloaded / 1024 / 1024).toFixed(2) +
      "MB of " +
      (total / 1024 / 1024).toFixed(2) +
      "MB";
    progress2.value = progress2v;

    var progress3v =
      "Running for : " + downloadedMinutes.toFixed(2) + "minutes";
    progress3.value = progress3v;

    var progress4v =
      "Estimated time left : " +
      (downloadedMinutes / floatDownloaded - downloadedMinutes).toFixed(2) +
      "minutes";
    progress4.value = progress4v;
  });
  video.on("end", () => {
    status.value = msgfinished;
    status1.value =
      "Video saved to " + `${app.getPath("home")}/Downloads/${name}.mp4`;
  });
}

//GET AUDIO FUNCTION

function downAudio() {
  const url = view.getURL();


  let name = view.getTitle();


  let start = Date.now();
  const audioOutput = path.resolve(
  __dirname,
  `${app.getPath("home")}/Downloads/${name}.m4a`
);

  ytdl(url, {
    filter: format => {
      return format.container === "m4a" && !format.encoding;
    }
  })
    .pipe(fs.createWriteStream(audioOutput))
    .on("finish", () => {
      ffmpeg()
        .on("error", console.error)
        .on("progress", progress => {
          status.value = msgstart;
          progress1.value = progress.targetSize + "kb downloaded";
        })
        .on("end", () => {
          fs.unlink(audioOutput, err => {
            if (err) console.error(err);
            else {
                    status.value = msgfinished;
                    progress4.value =
                      "Success" +
                      (Date.now() - start) / 1000 +
                      "s";
            }
          });
        });
    });
}

//Move to Previous song

function goBackward() {
  view.goBack();
}

//Exit from JDOWNLOADER

function goExit() {
  app.exit(0);
}

//Move to Next song

function goNext() {
  view.goForward();
}

//Assign respective values

video.addEventListener("click", downVideo);
audio.addEventListener("click", downAudio);
power.addEventListener("click", goExit);
backward.addEventListener("click", goBackward);
forward.addEventListener("click", goNext);
