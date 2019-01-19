function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
var player = document.getElementById('player');
let shouldStop = false;
let stopped = false;
const downloadLink = document.getElementById('download');
const bicepButton = document.getElementById('bicepButton');
const shoulderButton = document.getElementById('shoulderButton');

let flag = 0;
bicepButton.addEventListener('click', function() {
  shouldStop = true;
  console.log('entered bicep');
  flag = 1;
})

shoulderButton.addEventListener('click', function() {
  shouldStop = true;
  console.log('entered shoulder');
  flag = 2;
})

var handleSuccess = function(stream) {
  player.srcObject = stream;
  const options = {mimeType: 'video/webm'};
  const recordedChunks = [];
  const mediaRecorder = new MediaRecorder(stream, options);

  mediaRecorder.addEventListener('dataavailable', function(e) {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }

    if(shouldStop === true && stopped === false) {
      mediaRecorder.stop();
      stopped = true;
    }
 });

  mediaRecorder.addEventListener('stop', function() {
    downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
    temp = makeid();
    downloadLink.download = temp + '.webm';
    $('#download')[0].click();
    if (flag === 1){
        window.location = '/analysis_bicep?id=' + temp;
    }else if (flag === 2) {
        window.location = '/analysis_shoulder?id=' + temp
    }

  });

  mediaRecorder.start(1000);
};

navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    .then(handleSuccess);
