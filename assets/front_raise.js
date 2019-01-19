class FrontRaise
{
  constructor()
  {
    this.closing = true;
    this.last_angle = 0;
    this.rep = 0;
    this.start_ = 140;
    this.end_ = 65;
    this.elbow_ = 15;
    this.midpoint_achieved_ = false;
    this.start_achieved_ = false;
  }

  // main_point(angle)
  // {
  //     res = 0
  //     if ((angle>=(this.start_-2) || angle<=this.end_+2)){
  //         if ((angle<=this.end_+2)){
  //             res = 2;
  //         }
  //         else res = 1
  //     }
  //   // var res = (angle>=(this.start_-2) || angle<=this.end_+2) ? ((angle<=this.end_+2)? 2 : 1) : 0;
  //   return res;
  // }

  analyze_angles(angles)
  {
    var maxima = Number.MIN_SAFE_INTEGER; // at top
    var minima = Number.MAX_SAFE_INTEGER; // at bottom
    var opening = false; //top
    var closing = false; //bottom
    var last_open = undefined;
    this.last_angle = angles[angles.length - 1];
    for (var i = angles.length - 1; i >= 0; i--){
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
          opening = true;
          last_open = true;
        }
        else
        {
          closing = true;
          last_open = false;
        }
      }
    }

    var type = 0;
    /**
    Types
    1 : opening, not yet reaching start_
    2 : opening, reaching start_
    3 : opening and closing, crossed start_
    4 : opening and closing, crossed end_
    5 : closing, not reaching end_
    6 : closing, reaching end_
    7 : opening and closing, not crossing either
    */

    if (opening && closing) type = this.start_ <= maxima ? 3 : (this.end_ >= minima ? 4 : 7)  ;
    else if (opening) type = this.start_ <= maxima ? 2 : 1;
    else type = this.end_ >= minima ? 6 : 5;

    var res =
    {
      "maxima" : maxima,
      "minima" : minima,
      "type" : type
    };

    return res;
  }

  open_reach_start()
  {
    if(this.midpoint_achieved_) // the top of the rep was already achieved, now it is completed
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
    // this.opening = false;
  }

  open_not_reach_start()
  {
    if(!this.start_achieved_)
    {
      console.log("start to open the angle");
    }
    else if(!this.midpoint_achieved_)
    {
      console.log("start closing the angle");
    }
    else
    {
      console.log("open angle to complete the rep");
    }
    this.opening = true;
  }

  close_reach_end()
  {
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

  close_not_reaching_end()
  {
    if(!this.start_achieved_)
    {
      // ERROR incomplete rep -> add code to display
      console.log("incomplete rep, please extend arm to full open position");
    }
    else
    {
      this.closing = true;
    }
  }

  wavering_motion()
  {
    if(this.start_achieved_)
    {
      if(this.midpoint_achieved_)
      {
        console.log("extend to full length");
      }
      else
      {
        console.log("close angle");
      }
    }
    else
    {
      console.log("extend to full length to start rep");
    }
  }

  // change this.
    track_motion(angles)
  {
    const res = this.analyze_angles(angles);

    switch(res.type)
    {
      case 1 : this.open_not_reach_start();
      break;
      case 2 : this.open_reach_start();
      break;
      case 3 : this.open_reach_start();
      break;
      case 4 : this.close_reach_end();
      break;
      case 5 : this.close_not_reaching_end();
      break;
      case 6 : this.close_reach_end();
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
