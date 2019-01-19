let video;
let poseNet;
let poses = [];
let elbow_array = [];
let counter = 0;
let back_error = false;
let elbow_error = false;
let rep_counter = 0;
let angles = [];
let exercise;

function setup() {

  createCanvas(640, 480);
  // temp = $("#videoname")[0].innerHTML;
  // video = createVideo([temp+'.webm']);
  video = createCapture(VIDEO)
  video.size(width, height);
  poseNet = ml5.poseNet(video, 'single', modelReady);
  poseNet.on('pose', function(results) {
    poses = results;
  });
  video.hide();
  exercise = new FrontRaise();
}

function draw() {
  image(video, 0, 0, width, height); // draw the video frame to canvas

  var shoulder_angle = getAngle(1);
  var elbow_angle = getAngle(2);
  var back_angle = getAngle(3);
  var main_point = exercise.main_point(shoulder_angle);

  drawKeypoints(main_point,0);
  drawSkeleton();

  if(angles.length<25)
  {
    angles.push(shoulder_angle);
  }
  else
  {
    exercise.track_motion(angles);
    angles = [];
  }

}

function mousePressed() {
  video.loop();
}

function modelReady() {
  console.log("start");
  select('#status').html('Model Loaded');

}

function drawKeypoints(main_point,elbow_out)  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // if (keypoint.part === 'leftHip' || keypoint.part === 'leftShoulder'
      // || keypoint.part === 'leftWrist' || keypoint.part === 'leftElbow'){
      //     if (keypoint.score > 0.3) {
      //         fill(255, 0, 0);
      //         noStroke();
      //         ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      //     }
      // }

      if (keypoint.part === 'leftHip' || keypoint.part === 'leftShoulder'
      || keypoint.part === 'leftWrist' || keypoint.part === 'leftElbow')
      {
          if (keypoint.score > 0.3) {
              if(main_point)fill(0,255, 0);
              else fill(255, 0, 0);
              noStroke();
              ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
              // if (keypoint.part=="leftElbow") {
              //   if (elbow_out){
              //     fill(255,200,0);
              //   }
              // }
          }
      }

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
    // console.log('hahah');
      for (let i = 0; i < poses.length; i++) {
          let pose = poses[0].pose;
          let lw = undefined;let ls= undefined;let le= undefined; let lh= undefined;
          var f1 = 0;var f2 = 0;var f3 = 0;var f4 = 0;
          for (let j=0; j<pose.keypoints.length;j++){
              if(pose.keypoints[j].part === 'leftWrist'){
                  // console.log('1');
                  f1 = 1
                  lw = pose.keypoints[j];
              }else if(pose.keypoints[j].part === 'leftShoulder'){
                  // console.log('2');
                  f2 = 1
                  ls = pose.keypoints[j];
              }else if(pose.keypoints[j].part === 'leftElbow'){
                  // console.log('3');
                  f3 = 1;
                  le = pose.keypoints[j];
              }else if(pose.keypoints[j].part === 'leftHip'){
                  // console.log('4');
                  f4 = 1;
                  lh = pose.keypoints[j];
              }
          }
          if (f1 && f2 && f3 && f4){
              // console.log('here 1', part);
              switch(part)
              {
                case 1 : return angle(lw.position,ls.position,lh.position);
                break;
                case 2 : return angle(lw.position,le.position,ls.position);
                break;
                default : return angle(ls.position,lh.position, {
                  x:lh.position.x - 50,
                  y:lh.position.y
              });
              }
          }

      // let lw = pose.keypoints.find( obj => {
      //     return obj.part === 'leftWrist'
      // })
      // let ls = pose.keypoints.find( obj => {
      //     return obj.part === 'leftShoulder'
      // })
      // let le = pose.keypoints.find( obj => {
      //     return obj.part === 'leftElbow'
      // })
      // let lh = pose.keypoints.find( obj => {
      //     return obj.part === 'leftHip'
      // })
      // console.log(angle(lw.position, ls.position, lh.position));
      // switch(part)
      // {
      //   case 1 : return angle(lw.position,ls.position,lh.position);
      //   break;
      //   case 2 : return angle(lw.position,le.position,ls.position);
      //   break;
      //   default : return angle(ls.position,lh.position);
      // }


    }
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
