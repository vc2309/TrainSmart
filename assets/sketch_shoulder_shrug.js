
let video;
let poseNet;
let poses = [];
let elbow_array = [];
let bcurl = true;
let BicepCurl = class {
  
  constructor(){
    this.closing = true;
    this.last_angle = 0;
    this.rep = 0;
    this.start_ = 150;
    this.end_ = 60;
  }

  start_point(angle)
  {
    return this.start_ <= angle;
  }

  track_motion(angle)
  {
    if (angle>this.last_angle) //opening up
    {
      if (!this.closing){ //it's already opening
        // 1. check if its passed the po

      }
    }
  }

}
let exercise = null;
function setup() {
  createCanvas(710, 400);
  // specify multiple formats for different browsers
  fingers = createVideo(['test.webm']);
  
  fingers.size(width, height);
  fingers.speed(0.75);
  fingers.volume(0);
  fingers.hide(); // by default video shows up in separate dom
                  // element. hide it and draw it to the canvas
                  // instead

  exercise = new BicepCurl();
  poseNet = ml5.poseNet(fingers, modelReady);

poseNet.on('pose', function(results) {
  
    poses = results;
  });
fingers.hide();
}

function draw() {
  image(fingers, 0, 0, width, height); // draw the video frame to canvas
  drawKeypoints();
  drawSkeleton();
  
  // if()

  
}

function mousePressed() {
  fingers.loop();
    // fingers.loop(); // set the video to loop and start playing
}



function modelReady() {
  console.log("start");
  select('#status').html('Model Loaded');

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
  // video.loop();
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

function angle(A, B, C){
    var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));
    var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2));
    var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
    let angle = Math.acos((BC*BC+AB*AB-(AC*AC))/(2*BC*AB));
    // console.log(angle*180/Math.PI);
    return angle*180/Math.PI;
}

function getAngle() {
    
      for (let i = 0; i < poses.length; i++) {
      let pose = poses[0].pose;
      let lw = pose.keypoints.find( obj => {
          return obj.part === 'leftWrist'
      })
      let ls = pose.keypoints.find( obj => {
          return obj.part === 'leftShoulder'
      })
      let le = pose.keypoints.find( obj => {
          return obj.part === 'leftElbow'
      })
      let lh = pose.keypoints.find( obj => {
          return obj.part === 'leftHip'
      })
      return angle(lw.position,le.position,ls.position);
      
    }
  }
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function opening(){
 
  last_angle = 0;
  for (var i=0;i<1000;i+=1){ 
    // console.log(i);
    // await sleep(2000);
    cur_angle = getAngle();
    console.log(last_angle,cur_angle);
    if(cur_angle  < last_angle){

      return false;
    }
    last_angle=cur_angle;
  }
  return true;
}