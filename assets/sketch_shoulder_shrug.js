let video;
let poseNet;
let poses = [];
let elbow_array = [];
let bcurl = true;
let angles = [];
let exercise = null;
let poseNetOptions = { 
 imageScaleFactor: 1,
 outputStride: 10,
 flipHorizontal: false,
 minConfidence: 0.5,
 maxPoseDetections: 1,
 scoreThreshold: 0.5,
 nmsRadius: 200,
 detectionType: 'single',
 multiplier: 0.25,
}

function setup() {
  createCanvas(710, 400);
  // specify multiple formats for different browsers
  // fingers = createVideo(['test.webm']);
  fingers = createCapture(VIDEO);
  // fingers.size(width, height);
  // fingers.speed(0.75);
  // fingers.volume(0);
  fingers.hide(); // by default video shows up in separate dom
                  // element. hide it and draw it to the canvas
                  // instead
  exercise = new BicepCurl();
  poseNet = ml5.poseNet(fingers,"single", modelReady);

  poseNet.on('pose',  function(results) {
    poses = results;
    });
}

function draw() {
  image(fingers, 0, 0, width, height); // draw the video frame to canvas
  var bicep_angle = getAngle(1);
  var elbow_angle = getAngle(2);
  var main_point = exercise.main_point(bicep_angle);
  var elbow_out = exercise.check_elbow(elbow_angle);

  drawKeypoints(main_point,elbow_out);
  drawSkeleton();
  
  if(angles.length<50)
  {
    angles.push(bicep_angle);
  }
  else
  {
    exercise.track_motion(angles);
    angles = [];
  }
  
}

function mousePressed() {
  fingers.loop();
    // fingers.loop(); // set the video to loop and start playing
}

function mouseReleased()
{
  fingers.pause();
}

function modelReady() {
  console.log("start");
  select('#status').html('Model Loaded');

}

// A function to draw ellipses over the detected keypoints
function drawKeypoints(main_point,elbow_out)  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      if (main_point!=0)
      {
      fill(0,255, 0);  
      }
      else
      {
        fill(255, 0, 0);
      }

      // Check elbow
      if (keypoint.part=="leftElbow") {
        if (elbow_out){
          fill(255,200,0);   
        }
      }
      
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

function getAngle(part) {
    
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

      switch(part)
      {
        case 1 : return angle(lw.position,le.position,ls.position);
        break;
        case 2 : return angle(le.position,ls.position,{x:ls.position.x,y:(ls.position.y+100)});
        break;
        default : return angle(lw.position,le.position,ls.position);
      }
      
      
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