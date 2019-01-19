let video;
let poseNet;
let poses = [];
let elbow_array = [];
let counter = 0;
let back_error = false;
let elbow_error = false;
let rep_counter = 0;
let main_angles = [];
let exercise;
function setup() {

  createCanvas(640, 480);
  temp = $("#videoname")[0].innerHTML;
  video = createVideo([temp+'.webm']);
  video.size(width, height);
  poseNet = ml5.poseNet(video, 'single', modelReady);
  poseNet.on('pose', function(results) {
    poses = results;
  });
  video.hide();
  // exercise = new BicepCurl();
}

function mousePressed() {
  video.loop();
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  console.log('in draw')
  image(video, 0, 0, width, height);
  flag = trying();
  flag1 = trying2();
  drawKeypoints(flag, flag1);
  drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints(flag, flag1)  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];

      if (keypoint.part === 'leftHip' || keypoint.part === 'leftShoulder' || keypoint.part === 'leftWrist' || keypoint.part === 'leftElbow'){
          if (keypoint.score > 0.2) {
              if (flag || flag1){
                  fill(255, 0, 0);
              }else{
                  fill(0, 255, 0);
              }
            noStroke();
            ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
          }
      }
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
