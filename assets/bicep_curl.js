class BicepCurl {
  
  constructor(){
    this.closing = true;
    this.last_angle = 0;
    this.rep = 0;
    this.start_ = 150;
    this.end_ = 60;
  }

  analyze_angles(angles)
  {
    var maxima = Number.MIN_SAFE_INTEGER;
    var minima = Number.MAX_SAFE_INTEGER;
    var opening = false;
    var closing = false;
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
          opening = true;
        }
        else
        {
          closing = true;
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
    else if (opening) type = this.start_ <= maxima ? 1 : 2;
    else type = this.end_ >= minima ? 5 : 6;


    var res = {
      "maxima" : maxima,
      "type" : type
    };

    return res;
  }



}