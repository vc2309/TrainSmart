
let video;
let poseNet;
let poses = [];
let elbow_array = [];
function setup() {
  createCanvas(640, 480);
  video = createVideo(['test.mov']);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  // console.log('here')
  image(video, 0, 0, width, height);
  // ellipse(300, 400, 10, 10)
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
  checkShoulderShrug();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      fill(255, 0, 0);
      noStroke();
      ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
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

function angle_wrist_elbow(lw, le, ls){
    let A = ls.position
    let B = le.position
    let C = lw.position
    var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));
    var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2));
    var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
    let angle = Math.acos((BC*BC+AB*AB-(AC*AC))/(2*BC*AB));
    console.log(angle*180/Math.PI);
    // angle_wrist_elbow.push(angle)
    return angle
}

function checkShoulderShrug() {
    for (let i = 0; i < poses.length; i++) {
      // For each pose detected, loop through all the keypoints
      let pose = poses[i].pose;
      let lw = pose.keypoints.find( obj => {
          return obj.part === 'leftWrist'
      })
      let ls = pose.keypoints.find( obj => {
          return obj.part === 'leftShoulder'
      })
      let le = pose.keypoints.find( obj => {
          return obj.part === 'leftHip'
      })
      let lh = pose.keypoints.find( obj => {
          return obj.part === 'leftHip'
      })
      if (lw && le && ls){
          if(angle_wrist_elbow(lw, le, ls) < 170){
              console.log('left elbow angle too much');
          }
      }


      // let rw = pose.keypoints.find( obj => {
      //     return obj.part === 'rightWrist'
      // })
      // let rs = pose.keypoints.find( obj => {
      //     return obj.part === 'rightShoulder'
      // })
      // let re = pose.keypoints.find( obj => {
      //     return obj.part === 'rightHip'
      // })
      // let rh = pose.keypoints.find( obj => {
      //     return obj.part === 'rightHip'
      // })
      // if(angle_wrist_elbow(rw, re, rs) < 170){
      //      console.log('right elbow angle too much');
      // }
      // let torso_length = (lh.position.y - ls.position.y)/2 + (rh.position.y - rs.position.y)/2
      // compare torso length to range of movement of shoulders


    }
}
