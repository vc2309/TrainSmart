class FrontRaise
{
  constructor()
  {
    this.opening = true;
    this.closing = false;
    this.last_angle = 0;
    this.rep = 0;
    this.top_angle = 97; // changed
    this.bottom_angle = 35; // changed
    // this.elbow_ = 15;
    this.midpoint_achieved_ = false;
    this.start_achieved_ = false;
  }
  // closing point and opening point of bicep curl
  main_point(angle)
  {
      // var temp = 0
      if (angle >= (this.top_angle-2) || angle <= (this.bottom_angle+2) ){
          // if (angle <= this.end_+2 ){
          //     res = 2;
          // }
          // else res = 1
          return 1;
      }
    // var res = (angle>=(this.start_-2) || angle<=this.end_+2) ? ((angle<=this.end_+2)? 2 : 1) : 0;
    // return res;
    return 0;
  }

  analyze_angles(angles)
  {
    var maxima = Number.MIN_SAFE_INTEGER; // at top
    var minima = Number.MAX_SAFE_INTEGER; // at bottom
    var opening = false; // going up
    var closing = false; // going down
    var last_open = undefined;
    this.last_angle = angles[angles.length - 1];
    for (var i = angles.length - 1; i >= 0; i--)
    {
      if(maxima<angles[i])
      {
        maxima = angles[i];
      }
      if(minima>angles[i])
      {
        minima = angles[i];
      }

      if(i<angles.length-1)
      {
        if(angles[i]<=angles[i+1])
        {
          opening = true; // going up
          last_open = true;
        }
        else
        {
          closing = true; // going down
          last_open = false;
        }
      }
    }
    console.log('minima', minima);
    var type = 0;
    /**
    Types
    1 : opening, not yet reaching top
    2 : opening, reaching top
    3 : opening and closing, crossed top
    4 : opening and closing, crossed bottom
    5 : closing, not reaching bottom
    6 : closing, reaching bottom
    7 : opening and closing, not crossing either
    */

    if(opening && closing){
        if(this.top_angle <= maxima)type = 3;
        else if (this.bottom_angle >= minima)type = 4;
        else type = 7;
    }
    else if (opening){
        if (this.top_angle <= maxima)type = 2;
        else type = 1;
    }
    else if (this.bottom_angle >= minima)type = 6;
    else type = 5;

    var res =
    {
      "maxima" : maxima,
      "minima" : minima,
      "type" : type
    };

    return res;
  }

  open_reach_top(){
      console.log('open_reach_top');
      if(!this.start_achieved_)
      {
        // ERROR incomplete rep -> add code to display
        console.log("incomplete rep, please extend arm to full open position");
      }
      else
      {
        this.closing = true;
        this.midpoint_achieved_ = true;
      }
  }

  close_reach_bottom(){
      console.log('close_reach_bottom');
      if(this.midpoint_achieved_)
      {
        this.rep++;
        console.log("REP",this.rep);
        this.midpoint_achieved_ = false;
        this.start_achieved_ = true;
      }
      else
      {
        this.start_achieved_ = true;
      }
  }

  // open_not_reach_top()
  // {
  //   if(!this.start_achieved_)
  //   {
  //     console.log("start to open the angle");
  //   }
  //   else if(!this.midpoint_achieved_)
  //   {
  //     console.log("start closing the angle");
  //   }
  //   else
  //   {
  //     console.log("open angle to complete the rep");
  //   }
  //   this.opening = true;
  // }

  // close_reach_bottom()
  // {
  //   if(!this.start_achieved_)
  //   {
  //     // ERROR incomplete rep -> add code to display
  //     console.log("incomplete rep, please extend arm to full open position");
  //   }
  //   else
  //   {
  //     this.closing = true;
  //     this.midpoint_achieved_ = true;
  //   }
  // }

  // close_not_reaching_bottom()
  // {
  //   if(!this.start_achieved_)
  //   {
  //     // ERROR incomplete rep -> add code to display
  //     console.log("incomplete rep, please extend arm to full open position");
  //   }
  //   else
  //   {
  //     this.closing = true;
  //   }
  // }
  //
  // wavering_motion()
  // {
  //   if(this.start_achieved_)
  //   {
  //     if(this.midpoint_achieved_)
  //     {
  //       console.log("extend to full length");
  //     }
  //     else
  //     {
  //       console.log("close angle");
  //     }
  //   }
  //   else
  //   {
  //     console.log("extend to full length to start rep");
  //   }
  // }

  track_motion(angles)
  {
    var res = this.analyze_angles(angles);
    console.log(res.type);
    switch(res.type)
    {
      case 1 : this.open_not_reach_top();
      break;
      case 2 : this.open_reach_top();
      break;
      case 3 : this.open_reach_top();
      break;
      case 4 : this.close_reach_bottom();
      break;
      case 5 : this.close_not_reaching_bottom();
      break;
      case 6 : this.close_reach_bottom();
      break;
      default : this.wavering_motion();
    }
  }

  check_elbow(elbow_angle)
  {
      // console.log("an",elbow_angle)
      if(elbow_angle>=this.elbow_)
      {
        return true;
      }
      return false;

  }

}
