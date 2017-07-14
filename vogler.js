

//constant values 

var MAXVALUE=18000;

//global variables
var address=[]; //all the in- output values which are readable 
var cur=0; //0 is value of K1 ; index of address
var ccon={name: "none", in: "none", out: "none"}; // current wire connection
var mouse=false; // mouse over display
var intmode="hold"; //integrator mode ; can be "hold", "ic" or "run"
displayMode='voltmeter';
osciCur=0; // current position of oscilloscope beam
recentSwitch=false; // recent switch to oscilloscope


//calculating elements
var un=undefined;
var int1={int1ic: un, int1p10: un, int1p1: un, int1U: un, int1D: un, ic: un};
var int2={int2ic: un, int1p10: un, int2p1: un, int2U: un, int2D: un, ic: un};
var sum1={sum1p10: un, sum1p1: un, sum1pp1: un, sum1U: un, sum1D: un};
var sum2={sum2p10: un, sum2p1: un, sum2pp1: un, sum2U: un, sum2D: un};
var sum3={sum3p10: un, sum3p1: un, sum3pp1: un, sum3U: un, sum3D: un};

var opi={opiSP: un, opip1: un, opipp1: un, opiU: un, opiD: un};
var sinus={sinp1: un, sinU: un, sinD: un};
var mult={multX1: un, multZ1: un, multY1: un, multZ2: un, multY2: un, multU: un, multD};

//canvas initialisation
var c = document.getElementById("oscilloscope");
var ctx=c.getContext("2d");

// the various buttons
var onoff=false;
var reset=false;


$("#onoff").click(function(){
 
 if($("#onoff").text()=='-'){$("#onoff").html('+');onoff=true;}
 else{$("#onoff").html('-');onoff=false;}
 console.log("on/off button pressed");
 if(onoff)
  {compute();}
});

$("#reset").click(function(){
 
 if($("#reset").text()=='-'){$("#reset").html('+');reset=true;}
 else{$("#reset").html('-');reset=false;}
 console.log("reset button pressed");
 if(reset)
  {resetAddress();
   console.log("system reset");
  }
});

function voltmeter(x){
 var l,y,pol;
 if(x>=0)
  {pol=true;ctx.strokeStyle = '#000000';}
 else
  {pol=false;x=x*-1;ctx.strokeStyle = '#ff0000';}

 if(x==0)
  {//ctx.setTransform(1, 0, 0, 1, 0, 0);
   ctx.clearRect(0, 0, c.width, c.height);
   ctx.beginPath(); 
   ctx.moveTo(160,100);
   ctx.lineTo(80,100);
   ctx.stroke();
  }
 if(x>MAXVALUE) 
  {console.log("overload !!!");  
   alert("overload !!!");
   onoff=false;
  }
 else
  {x=x/100; // x is an angle between 0 and 180 
   var rad=x*0.01745329252;
   y=Math.sin(rad)*80;
   l=Math.cos(rad)*80;
   /*
   console.log("rad "+rad);
   console.log("l "+l);
   console.log("y "+y);*/

   if(x>90)
    {rad=(90-(x-90))*0.01745329252;
     y=Math.sin(rad)*80;
     l=Math.cos(rad)*80; 
     l=l*-1;
     console.log("l y "+l+" "+y);
    }
   
   //ctx.setTransform(1, 0, 0, 1, 0, 0);
   ctx.clearRect(0, 0, c.width, c.height);
   ctx.beginPath();
   ctx.moveTo(160,100);
   ctx.lineTo(160-l,100-y);
   ctx.stroke();
   console.log("value at voltmeter "+x);
   if(pol)
    {console.log("polarity at voltmeter is positive");} 
   else
    {console.log("polarity at voltmeter is negative");} 
  }
}

$(document).ready(function(){
  console.log("document is ready");
  //create address array
  createAddress();
  //initialise voltmeter
  ctx.moveTo(160,100);
  ctx.lineTo(80,100);
  ctx.stroke();
  ctx.save();
});

$("#aselect").click(function(){
  ++cur;
  console.log("cur changed to "+cur);
  if(cur>11){cur=0;} 
  if(cur==0){$("#aselect").html("K1");}
  if(cur==1){$("#aselect").html("K2");}
  if(cur==2){$("#aselect").html("K3");}
  if(cur==3){$("#aselect").html("K4");}
  if(cur==4){$("#aselect").html("I1");}
  if(cur==5){$("#aselect").html("I2");}
  if(cur==6){$("#aselect").html("S1");}
  if(cur==7){$("#aselect").html("S2");}
  if(cur==8){$("#aselect").html("S3");}
  if(cur==9){$("#aselect").html("OP");}
  if(cur==10){$("#aselect").html("Ml");}
  if(cur==11){$("#aselect").html("SN");}
  displayUpdate();
});

$("#k1in").change(function(){
  var s,n;
  s=$("#k1in").val();
  n=parseFloat(s);
  console.log("k1 value changed to "+n);
  address[0]=n;
  displayUpdate();
});

$("#k2in").change(function(){
  var s,n;
  s=$("#k2in").val();
  n=parseFloat(s);
  console.log("k2 value changed to "+n);
  address[1]=n;
  displayUpdate();
});

$("#k3in").change(function(){
  var s,n;
  s=$("#k3in").val();
  n=parseFloat(s);
  console.log("k3 value changed to "+n);
  address[2]=n;
  displayUpdate();
});

$("#k4in").change(function(){
  var s,n;
  s=$("#k4in").val();
  n=parseFloat(s);
  console.log("k4 value changed to "+n);
  address[3]=n;
  displayUpdate();
});

function compute(){
  console.log("computing");
  Integrator1();
  Integrator2();
  Summer1();
  Summer2();
  Summer3();
  Amplifier();
  Multiplicator();
  Giver();
  displayUpdate();
}


function createAddress(){
 for(var i=0;i<12;++i){
  address.push(0); 
 }
}

function resetAddress(){
 for(var i=0;i<12;++i){
  address[i]=0; 
 }
 $("#k1in").val(0);
 $("#k2in").val(0);
 $("#k3in").val(0);
 $("#k4in").val(0); 
}

function displayUpdate(){
 if(onoff&&displayMode=='voltmeter')
   {voltmeter(address[cur]);}  
 if(onoff&&displayMode=='oscilloscope')
   {oscilloscope(address[cur]);}  
}

function qconnected(){
 if((ccon.in!="none")&&(ccon.out!="none"))
  {console.log(ccon.in+" connected to "+ccon.out);
   ccon.in=ccon.out="none";
   ccon.name="none";
  }
}

$("#k1y").click(function(){
 var cs=$("#k1y").text();
 if(ccon.name=="none")
  {ccon.name="&alpha;1";}
 if((cs=="K1"))
  {$("#k1y").html(ccon.name);
   ccon.in=0; // K1 is first in array address
  }
 else
  {$("#k1y").html("K1");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

$("#k1U").click(function(){
 var cs=$("#k1U").text();
 if(ccon.name=="none")
  {ccon.name="&alpha;2";}
 if((cs=="K1"))
  {$("#k1U").html(ccon.name);
   ccon.in=0; // K1 is first in array address
  }
 else
  {$("#k1U").html("K1");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

$("#k1D").click(function(){
 var cs=$("#k1D").text();
 if(ccon.name=="none")
  {ccon.name="&alpha;3";}
 if((cs=="K1"))
  {$("#k1D").html(ccon.name);
   ccon.in=0; // K1 is first in array address
  }
 else
  {$("#k1D").html("K1");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

$("#k2y").click(function(){
 var cs=$("#k2y").text();
 if(ccon.name=="none")
  {ccon.name="&beta;1";}
 if((cs=="K2"))
  {$("#k2y").html(ccon.name);
   ccon.in=1; 
  }
 else
  {$("#k2y").html("K2");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

$("#k2U").click(function(){
 var cs=$("#k2U").text();
 if(ccon.name=="none")
  {ccon.name="&beta;2";}
 if((cs=="K2"))
  {$("#k2U").html(ccon.name);
   ccon.in=1; 
  }
 else
  {$("#k2U").html("K2");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

$("#k2D").click(function(){
 var cs=$("#k2D").text();
 if(ccon.name=="none")
  {ccon.name="&beta;3";}
 if((cs=="K2"))
  {$("#k2D").html(ccon.name);
   ccon.in=1; 
  }
 else
  {$("#k2D").html("K2");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

$("#k3y").click(function(){
 var cs=$("#k3y").text();
 if(ccon.name=="none")
  {ccon.name="&gamma;1";}
 if((cs=="K3"))
  {$("#k3y").html(ccon.name);
   ccon.in=2; 
  }
 else
  {$("#k3y").html("K3");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

$("#k3U").click(function(){
 var cs=$("#k3U").text();
 if(ccon.name=="none")
  {ccon.name="&gamma;2";}
 if((cs=="K3"))
  {$("#k3U").html(ccon.name);
   ccon.in=2; 
  }
 else
  {$("#k3U").html("K3");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

$("#k3D").click(function(){
 var cs=$("#k3D").text();
 if(ccon.name=="none")
  {ccon.name="&gamma;3";}
 if((cs=="K3"))
  {$("#k3D").html(ccon.name);
   ccon.in=2; 
  }
 else
  {$("#k3D").html("K3");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

$("#k4y").click(function(){
 var cs=$("#k4y").text();
 if(ccon.name=="none")
  {ccon.name="&delta;1";}
 if((cs=="K4"))
  {$("#k4y").html(ccon.name);
   ccon.in=3; 
  }
 else
  {$("#k4y").html("K4");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

$("#k4U").click(function(){
 var cs=$("#k4U").text();
 if(ccon.name=="none")
  {ccon.name="&delta;2";}
 if((cs=="K4"))
  {$("#k4U").html(ccon.name);
   ccon.in=3; 
  }
 else
  {$("#k4U").html("K4");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

$("#k4D").click(function(){
 var cs=$("#k4D").text();
 if(ccon.name=="none")
  {ccon.name="&delta;3";}
 if((cs=="K4"))
  {$("#k4D").html(ccon.name);
   ccon.in=3; 
  }
 else
  {$("#k4D").html("K4");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});


$("#sum1p1").click(function(){
 var cs=$("#sum1p1").text();
 /*if(ccon.name=="none")
  {ccon.name="&sigma;0";}*/
 if(cs=="01")
  {ccon.out="sum1p1";
   if(ccon.in!="none")
    {sum1.sum1p1=ccon.in;
     $("#sum1p1").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("sum1p1: "+sum1.sum1p1);
    }
  }
 else
  {$("#sum1p1").html("01");
   ccon.name="none";
   ccon.out="none";
   sum1.sum1p1=undefined;
  }
 qconnected();
});

$("#sum1pp1").click(function(){
 var cs=$("#sum1pp1").text();
 /*if((ccon.name=="none"))
  {ccon.name="&sigma;1";}*/
 if(cs=="01")
  {ccon.out="sum1pp1";
   if(ccon.in!="none")
    {sum1.sum1pp1=ccon.in;
     $("#sum1pp1").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("sum1pp1: "+sum1.sum1pp1);
    }
  }
 else
  {$("#sum1pp1").html("01");
   ccon.name="none";
   ccon.out="none";
   sum1.sum1pp1=undefined;
  }
 qconnected();
});


$("#sum1p10").click(function(){
 var cs=$("#sum1p10").text();
 /*if(ccon.name=="none")
  {ccon.name="&sigma;x";}*/
 if(cs=="10")
  {ccon.out="sum1p10";
   if(ccon.in!="none")
    {sum1.sum1p10=ccon.in;
     $("#sum1p10").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("sum1p10: "+sum1.sum1p10);
    }
  }
 else
  {$("#sum1p10").html("10");
   ccon.name="none";
   ccon.out="none";
   sum1.sum1p10=undefined;
  }
 qconnected();
});

$("#sum2p1").click(function(){
 var cs=$("#sum2p1").text();
 
 if(cs=="01")
  {ccon.out="sum2p1";
   if(ccon.in!="none")
    {sum2.sum2p1=ccon.in;
     $("#sum2p1").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("sum2p1: "+sum2.sum2p1);
    }
  }
 else
  {$("#sum2p1").html("01");
   ccon.name="none";
   ccon.out="none";
   sum2.sum2p1=undefined;
  }
 qconnected();
});

$("#sum2pp1").click(function(){
 var cs=$("#sum2pp1").text();
 
 if(cs=="01")
  {ccon.out="sum2pp1";
   if(ccon.in!="none")
    {sum2.sum2pp1=ccon.in;
     $("#sum2pp1").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("sum2pp1: "+sum2.sum2pp1);
    }
  }
 else
  {$("#sum2pp1").html("01");
   ccon.name="none";
   ccon.out="none";
   sum2.sum2pp1=undefined;
  }
 qconnected();
});

$("#sum2p10").click(function(){
 var cs=$("#sum2p10").text();
 
 if(cs=="10")
  {ccon.out="sum2p10";
   if(ccon.in!="none")
    {sum2.sum2p10=ccon.in;
     $("#sum2p10").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("sum2p10: "+sum2.sum2p10);
    }
  }
 else
  {$("#sum2p10").html("10");
   ccon.name="none";
   ccon.out="none";
   sum2.sum2p10=undefined;
  }
 qconnected();
});

$("#sum3p1").click(function(){
 var cs=$("#sum3p1").text();
 
 if(cs=="01")
  {ccon.out="sum3p1";
   if(ccon.in!="none")
    {sum3.sum3p1=ccon.in;
     $("#sum3p1").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("sum3p1: "+sum3.sum3p1);
    }
  }
 else
  {$("#sum3p1").html("01");
   ccon.name="none";
   ccon.out="none";
   sum3.sum3p1=undefined;
  }
 qconnected();
});

$("#sum3pp1").click(function(){
 var cs=$("#sum3pp1").text();
 
 if(cs=="01")
  {ccon.out="sum3pp1";
   if(ccon.in!="none")
    {sum3.sum3pp1=ccon.in;
     $("#sum3pp1").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("sum3pp1: "+sum3.sum3pp1);
    }
  }
 else
  {$("#sum3pp1").html("01");
   ccon.name="none";
   ccon.out="none";
   sum3.sum3pp1=undefined;
  }
 qconnected();
});

$("#sum3p10").click(function(){
 var cs=$("#sum3p10").text();
 
 if(cs=="10")
  {ccon.out="sum3p10";
   if(ccon.in!="none")
    {sum3.sum3p10=ccon.in;
     $("#sum3p10").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("sum3p10: "+sum3.sum3p10);
    }
  }
 else
  {$("#sum3p10").html("10");
   ccon.name="none";
   ccon.out="none";
   sum3.sum3p10=undefined;
  }
 qconnected();
});


$("#sum1U").click(function(){
 var cs=$("#sum1U").text();
 if(ccon.name=="none")
  {ccon.name="&sigma;1";}
 if((cs=="S1"))
  {$("#sum1U").html(ccon.name);
   ccon.in=6; // S1 is index 6 in address
  }
 else
  {$("#sum1U").html("S1");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

$("#sum1D").click(function(){
 var cs=$("#sum1D").text();
 if(ccon.name=="none")
  {ccon.name="&sigma;2";}
 if((cs=="S1"))
  {$("#sum1D").html(ccon.name);
   ccon.in=6; // S1 is index 6 in address
  }
 else
  {$("#sum1D").html("S1");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

$("#sum2U").click(function(){
 var cs=$("#sum2U").text();
 if(ccon.name=="none")
  {ccon.name="&tau;1";}
 if((cs=="S2"))
  {$("#sum2U").html(ccon.name);
   ccon.in=7; 
  }
 else
  {$("#sum2U").html("S2");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

$("#sum2D").click(function(){
 var cs=$("#sum2D").text();
 if(ccon.name=="none")
  {ccon.name="&tau;2";}
 if((cs=="S2"))
  {$("#sum2D").html(ccon.name);
   ccon.in=7; 
  }
 else
  {$("#sum2D").html("S2");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

$("#sum3U").click(function(){
 var cs=$("#sum3U").text();
 if(ccon.name=="none")
  {ccon.name="&upsilon;1";}
 if((cs=="S3"))
  {$("#sum3U").html(ccon.name);
   ccon.in=8; 
  }
 else
  {$("#sum3U").html("S3");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

$("#sum3D").click(function(){
 var cs=$("#sum3D").text();
 if(ccon.name=="none")
  {ccon.name="&upsilon;2";}
 if((cs=="S3"))
  {$("#sum3D").html(ccon.name);
   ccon.in=8; 
  }
 else
  {$("#sum3D").html("S1");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});



function Summer1(){
 var s1,s2,s3,o;
 if(sum1.sum1p10 === undefined){s1=0;} 
  else {s1=address[sum1.sum1p10]*10;}
 if(sum1.sum1p1 === undefined){s2=0;}
  else {s2=address[sum1.sum1p1];} 
 if(sum1.sum1pp1 === undefined){s3=0;} 
  else {s3=address[sum1.sum1pp1];}
 o=(s1+s2+s3)*-1;
 address[6]=o;
}

function Summer2(){
 var s1,s2,s3,o;
 if(sum2.sum2p10 === undefined){s1=0;} 
  else {s1=address[sum2.sum2p10]*10;}
 if(sum2.sum2p1 === undefined){s2=0;}
  else {s2=address[sum2.sum2p1];} 
 if(sum2.sum2pp1 === undefined){s3=0;} 
  else {s3=address[sum2.sum2pp1];}
 o=(s1+s2+s3)*-1;
 address[7]=o;
}

function Summer3(){
 var s1,s2,s3,o;
 if(sum3.sum3p10 === undefined){s1=0;} 
  else {s1=address[sum3.sum3p10]*10;}
 if(sum3.sum3p1 === undefined){s2=0;}
  else {s2=address[sum3.sum3p1];} 
 if(sum3.sum3pp1 === undefined){s3=0;} 
  else {s3=address[sum3.sum3pp1];}
 o=(s1+s2+s3)*-1;
 address[8]=o;
}




$("#oscilloscope").mouseover(function(){
 //alert(address[cur]);
 mouse=true;
 if(onoff&&displayMode=='voltmeter')
  {ctx.font = "21px Arial";
   ctx.fillText("current value: "+address[cur],10,50);
  }
});

$("#oscilloscope").mouseout(function(){
 mouse=false;
 displayUpdate();
});

setInterval(function(){ 
 if(onoff&&!mouse)
  {compute(); 
   displayUpdate();
  }
 }, 81);

$("#intmode").click(function(){
 if(intmode=="hold")
  {intmode="ic";$("#intmode").html("IC");return;}
 if(intmode=="run")
  {intmode="hold";$("#intmode").html("HOLD");return;}
 if(intmode=="ic")
  {intmode="run";$("#intmode").html("RUN");return;}
});


function Integrator1(){
 var x1,x2;
 if(int1.int1p10===undefined){x2=0;}
  else{x2=address[int1.int1p10]*0.1;}
 if(int1.int1p1===undefined){x1=0;}
  else{x1=address[int1.int1p1];}

 if(intmode=="ic")
  {if(int1.int1ic===undefined){int1.ic=0;}
   else{int1.ic=address[int1.int1ic];}  
  }

 if(intmode=="run")
  {if(int1.ic===undefined){int1.ic=0;}
   int1.ic=int1.ic-(x1+x2);
   address[4]=int1.ic;
  }
}

function Integrator2(){
 var x1,x2;
 if(int2.int2p10===undefined){x2=0;}
  else{x2=address[int2.int2p10]*0.1;}
 if(int2.int2p1===undefined){x1=0;}
  else{x1=address[int2.int2p1];}

 if(intmode=="ic")
  {if(int2.int2ic===undefined){int2.ic=0;}
   else{int2.ic=address[int2.int2ic];}  
  }

 if(intmode=="run")
  {if(int2.ic===undefined){int2.ic=0;}
   int2.ic=int2.ic-(x1+x2);
   address[5]=int2.ic;
  }
}

$('#int1ic').click(function(){
 var cs=$("#int1ic").text();
 if(cs=="1C")
  {ccon.out="int1ic";
   if(ccon.in!="none")
    {int1.int1ic=ccon.in;
     $("#int1ic").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("int1ic: "+int1.int1ic);
    }
  }
 else
  {$("#int1ic").html("1C");
   ccon.name="none";
   ccon.out="none";
   int1.int1ic=undefined;
  }
 qconnected();   
});

$('#int1p1').click(function(){
 var cs=$("#int1p1").text();
 if(cs=="01")
  {ccon.out="int1p1";
   if(ccon.in!="none")
    {int1.int1p1=ccon.in;
     $("#int1p1").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("int1p1: "+int1.int1p1);
    }
  }
 else
  {$("#int1p1").html("01");
   ccon.name="none";
   ccon.out="none";
   int1.int1p1=undefined;
  }
 qconnected();   
});

$('#int1p10').click(function(){
 var cs=$("#int1p10").text();
 if(cs=="10")
  {ccon.out="int1p10";
   if(ccon.in!="none")
    {int1.int1p10=ccon.in;
     $("#int1p10").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("int1p10: "+int1.int1p10);
    }
  }
 else
  {$("#int1p10").html("10");
   ccon.name="none";
   ccon.out="none";
   int1.int1p10=undefined;
  }
 qconnected();   
});

$("#int1U").click(function(){
 var cs=$("#int1U").text();
 if(ccon.name=="none")
  {ccon.name="&iota;1";}
 if((cs=="IN"))
  {$("#int1U").html(ccon.name);
   ccon.in=4; // IN is index 4 in address
  }
 else
  {$("#int1U").html("IN");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

$("#int1D").click(function(){
 var cs=$("#int1D").text();
 if(ccon.name=="none")
  {ccon.name="&iota;2";}
 if((cs=="IN"))
  {$("#int1D").html(ccon.name);
   ccon.in=4; // IN is index 4 in address
  }
 else
  {$("#int1D").html("IN");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

$('#int2ic').click(function(){
 var cs=$("#int2ic").text();
 if(cs=="1C")
  {ccon.out="int2ic";
   if(ccon.in!="none")
    {int2.int2ic=ccon.in;
     $("#int2ic").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("int2ic: "+int2.int2ic);
    }
  }
 else
  {$("#int2ic").html("1C");
   ccon.name="none";
   ccon.out="none";
   int2.int2ic=undefined;
  }
 qconnected();   
});

$('#int2p1').click(function(){
 var cs=$("#int2p1").text();
 if(cs=="01")
  {ccon.out="int2p1";
   if(ccon.in!="none")
    {int2.int2p1=ccon.in;
     $("#int2p1").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("int2p1: "+int2.int2p1);
    }
  }
 else
  {$("#int2p1").html("01");
   ccon.name="none";
   ccon.out="none";
   int2.int2p1=undefined;
  }
 qconnected();   
});

$('#int2p10').click(function(){
 var cs=$("#int2p10").text();
 if(cs=="10")
  {ccon.out="int2p10";
   if(ccon.in!="none")
    {int2.int2p10=ccon.in;
     $("#int2p10").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("int2p10: "+int2.int2p10);
    }
  }
 else
  {$("#int2p10").html("10");
   ccon.name="none";
   ccon.out="none";
   int2.int2p10=undefined;
  }
 qconnected();   
});

$("#int2U").click(function(){
 var cs=$("#int2U").text();
 if(ccon.name=="none")
  {ccon.name="&kappa;1";}
 if((cs=="iN"))
  {$("#int2U").html(ccon.name);
   ccon.in=5; 
  }
 else
  {$("#int2U").html("iN");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

$("#int2D").click(function(){
 var cs=$("#int2D").text();
 if(ccon.name=="none")
  {ccon.name="&kappa;2";}
 if((cs=="iN"))
  {$("#int2D").html(ccon.name);
   ccon.in=5; 
  }
 else
  {$("#int2D").html("iN");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

function Amplifier(){
 var x1,x2,sp;
 if(opi.opiSP===undefined){sp=MAXVALUE;}
 else{sp=address[opi.opiSP];}

 if(opi.opip1===undefined){x1=0;} 
 else{x1=address[opi.opip1];}

 if(opi.opipp1===undefined){x2=0;} 
 else{x2=address[opi.opipp1];}

 if(x1>x2){address[9]=sp*-1;}
 if(x1<x2){address[9]=sp;}
 if(x1==x2){address[9]=0;}
 if(opi.opipp1==9){address[9]=x1*-1;} 
}


$('#opip1').click(function(){
 var cs=$("#opip1").text();
 if(cs=="01")
  {ccon.out="opip1";
   if(ccon.in!="none")
    {opi.opip1=ccon.in;
     $("#opip1").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("opip1: "+opi.opip1);
    }
  }
 else
  {$("#opip1").html("01");
   ccon.name="none";
   ccon.out="none";
   opi.opip1=undefined;
  }
 qconnected();   
});

$('#opipp1').click(function(){
 var cs=$("#opipp1").text();
 if(cs=="01")
  {ccon.out="opipp1";
   if(ccon.in!="none")
    {opi.opipp1=ccon.in;
     $("#opipp1").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("opipp1: "+opi.opipp1);
    }
  }
 else
  {$("#opipp1").html("01");
   ccon.name="none";
   ccon.out="none";
   opi.opipp1=undefined;
  }
 qconnected();   
});

$('#opiSP').click(function(){
 var cs=$("#opiSP").text();
 if(cs=="SP")
  {ccon.out="opiSP";
   if(ccon.in!="none")
    {opi.opiSP=ccon.in;
     $("#opiSP").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("opiSP: "+opi.opiSP);
    }
  }
 else
  {$("#opiSP").html("SP");
   ccon.name="none";
   ccon.out="none";
   opi.opiSP=undefined;
  }
 qconnected();   
});

$("#opiU").click(function(){
 var cs=$("#opiU").text();
 if(ccon.name=="none")
  {ccon.name="&omicron;1";}
 if((cs=="OP"))
  {$("#opiU").html(ccon.name);
   ccon.in=9; 
  }
 else
  {$("#opiU").html("OP");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

$("#opiD").click(function(){
 var cs=$("#opiD").text();
 if(ccon.name=="none")
  {ccon.name="&omicron;2";}
 if((cs=="OP"))
  {$("#opiD").html(ccon.name);
   ccon.in=9; 
  }
 else
  {$("#opiD").html("OP");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

function Giver(){
 var x=address[sinus.sinp1];
 address[11]=Math.sin((Math.PI/MAXVALUE)*x);
}

$('#sinp1').click(function(){
 var cs=$("#sinp1").text();
 if(cs=="SN")
  {ccon.out="sinp1";
   if(ccon.in!="none")
    {sinus.sinp1=ccon.in;
     $("#sinp1").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("sinp1: "+sinus.sinp1);
    }
  }
 else
  {$("#sinp1").html("SN");
   ccon.name="none";
   ccon.out="none";
   sinus.sinp1=undefined;
  }
 qconnected();   
});

$("#sinU").click(function(){
 var cs=$("#sinU").text();
 if(ccon.name=="none")
  {ccon.name="&xi;1";}
 if((cs=="SN"))
  {$("#sinU").html(ccon.name);
   ccon.in=11; 
  }
 else
  {$("#sinU").html("SN");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

$("#sinD").click(function(){
 var cs=$("#sinD").text();
 if(ccon.name=="none")
  {ccon.name="&xi;2";}
 if((cs=="SN"))
  {$("#sinD").html(ccon.name);
   ccon.in=11; 
  }
 else
  {$("#sinD").html("SN");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});


function Multiplicator(){
 var x,y,d;
 
 if(mult.multX1===undefined){x=0;}
 else{x=address[mult.multX1];}
 if(mult.multY1===undefined){y=0;}
 else{y=address[mult.multY1];}
 
 if(mult.multZ2===undefined){d=0;}
 else{d=address[mult.multZ2];}

 if(mult.multZ1==10) // if connected to multiplicator out
  {address[10]=x*y;}

 if(mult.multY2==10)
  {address[10]=d/x;}
}

$('#multX1').click(function(){
 var cs=$("#multX1").text();
 if(cs=="X1")
  {ccon.out="multX1";
   if(ccon.in!="none")
    {mult.multX1=ccon.in;
     $("#multX1").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("multX1: "+mult.multX1);
    }
  }
 else
  {$("#multX1").html("X1");
   ccon.name="none";
   ccon.out="none";
   mult.multX1=undefined;
  }
 qconnected();   
});

$('#multY1').click(function(){
 var cs=$("#multY1").text();
 if(cs=="Y1")
  {ccon.out="multY1";
   if(ccon.in!="none")
    {mult.multY1=ccon.in;
     $("#multY1").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("multY1: "+mult.multY1);
    }
  }
 else
  {$("#multY1").html("Y1");
   ccon.name="none";
   ccon.out="none";
   mult.multY1=undefined;
  }
 qconnected();   
});

$('#multY2').click(function(){
 var cs=$("#multY2").text();
 if(cs=="Y2")
  {ccon.out="multY2";
   if(ccon.in!="none")
    {mult.multY2=ccon.in;
     $("#multY2").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("multY2: "+mult.multY2);
    }
  }
 else
  {$("#multY2").html("Y2");
   ccon.name="none";
   ccon.out="none";
   mult.multY2=undefined;
  }
 qconnected();   
});

$('#multZ1').click(function(){
 var cs=$("#multZ1").text();
 if(cs=="Z1")
  {ccon.out="multZ1";
   if(ccon.in!="none")
    {mult.multZ1=ccon.in;
     $("#multZ1").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("multZ1: "+mult.multZ1);
    }
  }
 else
  {$("#multZ1").html("Z1");
   ccon.name="none";
   ccon.out="none";
   mult.multZ1=undefined;
  }
 qconnected();   
});

$('#multZ2').click(function(){
 var cs=$("#multZ2").text();
 if(cs=="Z2")
  {ccon.out="multZ2";
   if(ccon.in!="none")
    {mult.multZ2=ccon.in;
     $("#multZ2").html(ccon.name);  
     console.log(ccon.in+" wired to "+ccon.out); 
     console.log("multZ2: "+mult.multZ2);
    }
  }
 else
  {$("#multZ2").html("Z2");
   ccon.name="none";
   ccon.out="none";
   mult.multZ2=undefined;
  }
 qconnected();   
});

$("#multU").click(function(){
 var cs=$("#multU").text();
 if(ccon.name=="none")
  {ccon.name="&mu;1";}
 if((cs=="Ml"))
  {$("#multU").html(ccon.name);
   ccon.in=10; 
  }
 else
  {$("#multU").html("Ml");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

$("#multD").click(function(){
 var cs=$("#multD").text();
 if(ccon.name=="none")
  {ccon.name="&mu;1";}
 if((cs=="Ml"))
  {$("#multD").html(ccon.name);
   ccon.in=10; 
  }
 else
  {$("#multD").html("Ml");
   ccon.name="none";
   ccon.in="none";
  }
 qconnected();
});

$('#oscilloscope').click(function (){
 console.log('screen clicked');
 recentSwitch=true;
 if(displayMode=='voltmeter'){displayMode='oscilloscope';return;}
 if(displayMode=='oscilloscope'){displayMode='voltmeter';return;}
});

function oscilloscope(x){
 var y;
 

   if(osciCur==c.width){osciCur=0;}
   if(osciCur==0)
    {ctx.clearRect(0, 0, c.width, c.height);}
   if(recentSwitch)
    {ctx.clearRect(0, 0, c.width, c.height);
     recentSwitch=false;     
    }

   if(x>Math.abs(MAXVALUE)) 
    {console.log("overload !!!");  
     alert("overload !!!");
     onoff=false;
    }
   
   if(onoff)  
    {y=(x/MAXVALUE)*(c.height/2);
     if(y>=0){y=0.5*c.height-y;}
     if(y<0){y=Math.abs(y)+0.5*c.height;}
     console.log("y is "+y+" x is "+osciCur);
     ctx.beginPath(); 
     ctx.strokeStyle = '#0000ff';
     ctx.arc(osciCur,y,2,0,2*Math.PI);
     ctx.stroke();
     //ctx.close.Path(); 
     ++osciCur;
    } 
}

$('#help').click(function(){
 window.location="#instructions";
});

$('#demo').click(function(){
 $('#k1in').val("1024");
 $('#k2in').val("1");
 $('#k3in').val("0");
 $('#k4in').val("0");
 address[0]=1024;
 address[1]=0;
 address[2]=address[3]=address[4]=0;
 address[5]=1024;
 $("#k1y").html('&alpha;1');
 $("#k2y").html('&beta;1');
 $("#k3y").html('&gamma;1');
 int1.int1ic=2;
 int2.int2ic=0;
 int1.ic=0;
 int2.ic=1024;
 $("#int2ic").html('&alpha;1');
 $("#int1ic").html('&gamma;1');
 $("#sum1p1").html('&beta;1');
 sum1.sum1U="int1p1";
 int1.int1p1=6;
 $("#sum1U").html('&sigma;1');
 $("#int1p1").html('&sigma;1');
 int2.int2U="sum1pp1";
 sum1.sum1pp1=5;
 $("#sum1pp1").html('&kappa;1');
 $("#int2U").html('&kappa;1');
 int1.int1U="int2.int2p1"; 
 int2.int2p1=4;
 $("#int1U").html("&iota;1");
 $("#int2p1").html("&iota;1");
 displayMode="oscilloscope";
 intmode="run";
 onoff=true;
 $("#intmode").html("RUN");
 $("#onoff").html("+");
 cur=5;// current variable to display on screen
 $("#aselect").html("I2");
});

