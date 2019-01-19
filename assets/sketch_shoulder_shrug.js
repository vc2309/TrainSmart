// let video;
// let poseNet;
// let poses = [];
// let elbow_array = [];
// let bcurl = true;
// let angles = [];
// let exercise = null;
// let poseNetOptions = {
//  imageScaleFactor: 1,
//  outputStride: 10,
//  flipHorizontal: false,
//  minConfidence: 0.5,
//  maxPoseDetections: 1,
//  scoreThreshold: 0.5,
//  nmsRadius: 200,
//  detectionType: 'single',
//  multiplier: 0.25,
// }
//
// function setup() {
//   createCanvas(710, 400);
//   // specify multiple formats for different browsers
//   // fingers = createVideo(['test.webm']);
//   fingers = createCapture(VIDEO);
//   // fingers.size(width, height);
//   // fingers.speed(0.75);
//   // fingers.volume(0);
//   fingers.hide(); // by default video shows up in separate dom
//                   // element. hide it and draw it to the canvas
//                   // instead
//   exercise = new BicepCurl();
//   poseNet = ml5.poseNet(fingers,"single", modelReady);
//
//   poseNet.on('pose',  function(results) {
//     poses = results;
//     });
// }
//
// function draw() {
//   image(fingers, 0, 0, width, height); // draw the video frame to canvas
//   var bicep_angle = getAngle(1);
//   var elbow_angle = getAngle(2);
//   var main_point = exercise.main_point(bicep_angle);
//   var elbow_out = exercise.check_elbow(elbow_angle);
//
//   drawKeypoints(main_point,elbow_out);
//   drawSkeleton();
//
//   if(angles.length<50)
//   {
//     angles.push(bicep_angle);
//   }
//   else
//   {
//     exercise.track_motion(angles);
//     angles = [];
//   }
//
// }
//
// function mousePressed() {
//   fingers.loop();
//     // fingers.loop(); // set the video to loop and start playing
// }
//
// function mouseReleased()
// {
//   fingers.pause();
// }
//
// function modelReady() {
//   console.log("start");
//   select('#status').html('Model Loaded');
//
// }
//
// // A function to draw ellipses over the detected keypoints
// function drawKeypoints(main_point,elbow_out)  {
//   // Loop through all the poses detected
//   for (let i = 0; i < poses.length; i++) {
//     // For each pose detected, loop through all the keypoints
//     let pose = poses[i].pose;
//     for (let j = 0; j < pose.keypoints.length; j++) {
//       // A keypoint is an object describing a body part (like rightArm or leftShoulder)
//       let keypoint = pose.keypoints[j];
//       if (main_point!=0)
//       {
//       fill(0,255, 0);
//       }
//       else
//       {
//         fill(255, 0, 0);
//       }
//
//       // Check elbow
//       if (keypoint.part=="leftElbow") {
//         if (elbow_out){
//           fill(255,200,0);
//         }
//       }
//
//       noStroke();
//       ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
//     }
//   }
//
// }
//
// // A function to draw the skeletons
// function drawSkeleton() {
//   // video.loop();
//   // Loop through all the skeletons detected
//   for (let i = 0; i < poses.length; i++) {
//     let skeleton = poses[i].skeleton;
//     // console.log(skeleton);
//     // For every skeleton, loop through all body connections
//     for (let j = 0; j < skeleton.length; j++) {
//       let partA = skeleton[j][0];
//       let partB = skeleton[j][1];
//       stroke(255, 0, 0);
//       line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
//     }
//   }
// }
//
// function angle(A, B, C){
//     var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));
//     var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2));
//     var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
//     let angle = Math.acos((BC*BC+AB*AB-(AC*AC))/(2*BC*AB));
//     // console.log(angle*180/Math.PI);
//     return angle*180/Math.PI;
// }
//
// function getAngle(part) {
//
//       for (let i = 0; i < poses.length; i++) {
//       let pose = poses[0].pose;
//       let lw = pose.keypoints.find( obj => {
//           return obj.part === 'leftWrist'
//       })
//       let ls = pose.keypoints.find( obj => {
//           return obj.part === 'leftShoulder'
//       })
//       let le = pose.keypoints.find( obj => {
//           return obj.part === 'leftElbow'
//       })
//       let lh = pose.keypoints.find( obj => {
//           return obj.part === 'leftHip'
//       })
//
//       switch(part)
//       {
//         case 1 : return angle(lw.position,le.position,ls.position);
//         break;
//         case 2 : return angle(le.position,ls.position,{x:ls.position.x,y:(ls.position.y+100)});
//         break;
//         default : return angle(lw.position,le.position,ls.position);
//       }
//
//
//     }
//   }
// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
// function opening(){
//
//   last_angle = 0;
//   for (var i=0;i<1000;i+=1){
//     // console.log(i);
//     // await sleep(2000);
//     cur_angle = getAngle();
//     console.log(last_angle,cur_angle);
//     if(cur_angle  < last_angle){
//
//       return false;
//     }
//     last_angle=cur_angle;
//   }
//   return true;
// }

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

let player1;
let video;
let poseNet;
let poses = [];
let elbow_array = [];
function setup() {

    var player = document.getElementById('player');
    // var player1 = document.getElementById('player1');
    let shouldStop = false;
    let stopped = false;
    const downloadLink = document.getElementById('download');
    const stopButton = document.getElementById('stop');

    stopButton.addEventListener('click', function() {
      shouldStop = true;
      console.log('entered here 1');
    })

    var handleSuccess = function(stream) {
      console.log('entered here 2 ');
      player.srcObject = stream;
      const options = {mimeType: 'video/webm'};
      const recordedChunks = [];
      const mediaRecorder = new MediaRecorder(stream, options);

      mediaRecorder.addEventListener('dataavailable', function(e) {
          console.log('here');
        if (e.data.size > 0) {
          recordedChunks.push(e.data);
        }

        if(shouldStop === true && stopped === false) {
          mediaRecorder.stop();
          stopped = true;
          console.log('entered here');
        }
     });

      mediaRecorder.addEventListener('stop', function() {
         console.log('enetered here 2');
        downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
        // player1.srcObject = URL.createObjectURL(new Blob(recordedChunks));
        temp = makeid();
        downloadLink.download = temp + '.webm';
        // sleep()
        $('#download')[0].click();
        window.location = '/home?id=' + temp
        // $( "#download" ).click(function() {
        //     console.log('abeer sucks');
        //     // alert( "Handler for .click() called." );
        // });
        // var cnv = createCanvas(windowWidth, windowHeight);
        // cnv.style('display', 'block');
        // player1.src = URL.createObjectURL(new Blob(recordedChunks));
        // player1.play();
        // player1.width = width;
        // player1.height = height;
        //
        // poseNet = ml5.poseNet(document.getElementById('player1'), modelReady);
        // poseNet.on('pose', function(results) {
        //   poses = results;
        // });
        // player1.display = "none"
        // player.style.visibility = "hidden"
      });

      mediaRecorder.start(1000);
    };

    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(handleSuccess);

  // createCanvas(640, 480);
  // video = createCapture(VIDEO);
  // video.size(width, height);
  // poseNet = ml5.poseNet(video, modelReady);
  // poseNet.on('pose', function(results) {
  //   poses = results;
  // });
  // video.hide();
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function draw() {
  // console.log('in draw')
  image(video, 0, 0, width, height);
  // image(document.getElementById('player1'), 0, 0, width, height);
  // ellipse(300, 400, 10, 10)
  // We can call both functions to draw all keypoints and the skeletons
  flag = trying();
  drawKeypoints(flag);
  drawSkeleton();
  // checkFrontRaise();
  // setTimeout(, 5000)
}


setInterval(draw,20000);
// A function to draw ellipses over the detected keypoints
function drawKeypoints(flag)  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];

      if (keypoint.part === 'leftHip' || keypoint.part === 'leftShoulder' || keypoint.part === 'leftWrist' || keypoint.part === 'leftElbow'){
          if (keypoint.score > 0.2) {
              if (flag){
                  fill(255, 0, 0);
              }else{
                  fill(0, 255, 0);
              }
            noStroke();
            ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
          }
      }
      // Only draw an ellipse is the pose probability is bigger than 0.2

    }
  }

}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // console.log(skeleton);
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];

      stroke(255, 0, 0);
    line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);

//       if((partA.part == 'leftWrist' && partB.partB == 'leftElbow')
//       || (partB.part == 'leftShoulder' && partA.part == 'leftElbow')
//   || (partA.part == 'leftShoulder' && partB.partB == 'leftHip')
//     || (partA.part == 'leftElbow' && partB.partB == 'leftWrist')
//     || (partB.part == 'leftElbow' && partA.part == 'leftShoulder')
//     || (partA.part == 'leftHip' && partB.partB == 'leftShoulder')
// ){
//
//       }
    }
  }
}

function trying(){
    for (let i = 0; i < poses.length; i++) {
      // For each pose detected, loop through all the keypoints
      let pose = poses[i].pose;

      let ls = pose.keypoints.find( obj => {
          return obj.part === 'leftShoulder'
      })
      let lh = pose.keypoints.find( obj => {
          return obj.part === 'leftHip'
      })

      if (lh && ls){
          let A = ls.position
          let B = lh.position
          let C = {
                  x:B.x - 50,
                  y:B.y
              }
          var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));
          var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2));
          var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
          let angle =  Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
          if ((angle * (180/Math.PI)) > 100 || (angle * (180/Math.PI)) < 80){
              console.log("Entered here");
              return 1;
          }
      }
  }
  return 0;
}

function trying2(){
    for (let i = 0; i < poses.length; i++) {
      // For each pose detected, loop through all the keypoints
      let pose = poses[i].pose;

      let ls = pose.keypoints.find( obj => {
          return obj.part === 'leftShoulder'
      })
      let le = pose.keypoints.find( obj => {
          return obj.part === 'leftElbow'
      })
      let lw = pose.keypoints.find( obj => {
          return obj.part === 'leftWrist'
      })

      if (le && ls && lw){
          let A = ls.position
          let B = le.position
          let C = lw.position
          var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));
          var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2));
          var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
          let angle =  Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
          if ((angle * (180/Math.PI)) > 160 || (angle * (180/Math.PI)) < 140){
              return 1;
          }
      }
  }
  return 0;
}

// function checkFrontRaise() {
//     for (let i = 0; i < poses.length; i++) {
//       // For each pose detected, loop through all the keypoints
//       let pose = poses[i].pose;
//       let lw = pose.keypoints.find( obj => {
//           return obj.part === 'leftWrist'
//       })
//       let ls = pose.keypoints.find( obj => {
//           return obj.part === 'leftShoulder'
//       })
//       let lh = pose.keypoints.find( obj => {
//           return obj.part === 'leftHip'
//       })
//       let lk = pose.keypoints.find( obj => {
//           return obj.part === 'leftKnee'
//       })
//
//       if (lh && ls){
//           let A = ls.position
//           let B = lh.position
//           let C = {
//                   x:B.x - 50,
//                   y:B.y
//               }
//           var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));
//           var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2));
//           var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
//           let angle =  Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
//           if ((angle * (180/Math.PI)) > 100 || (angle * (180/Math.PI)) < 80){
//               console.log('HERE');
//               console.log('straighten up please');
//               stroke(0, 255, 0);
//               line(A.x, A.y, B.x, B.y);
//               fill(255, 0, 0);
//               noStroke();
//               ellipse(A.x, A.y, 10, 10);
//               fill(255, 0, 0);
//               noStroke();
//               ellipse(B.x, B, 10, 10);
//           }
//       }
//
//       // if (lw && ls && lh && lk){
//       //     flag = 0
//       //     if (lw.position.y < ls.position.y){
//       //         flag += 1
//       //     }
//       //     let A = ls.position;
//       //     let B = lh.position;
//       //     let C = lk.position;
//       //     console.log(A,B,C);
//       //     var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));
//       //     var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2));
//       //     var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
//       //     let angle =  Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
//       //
//       //     if ((angle * (180/Math.PI)) > 160){
//       //         flag += 1
//       //     }else{
//       //         console.log('straighten up please');
//       //         stroke(0, 255, 0);
//       //         line(ls.position.x, ls.position.y, lh.position.x, lh.position.y);
//       //         fill(255, 0, 0);
//       //         noStroke();
//       //         ellipse(ls.position.x, ls.position.y, 10, 10);
//       //         fill(255, 0, 0);
//       //         noStroke();
//       //         ellipse(lh.position.x, lh.position.y, 10, 10);
//       //     }
//       //
//       //     if (flag === 2){
//       //         console.log('complete');
//       //     }
//       // }
//     }
// }
