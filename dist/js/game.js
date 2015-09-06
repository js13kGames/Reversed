var STEPS = 15;
var NUMOFSQ=20;
var story='there is both in us.|dark.|and light.|and we can choose#at anytime.|to be a good one.|or a bad one.|maybe the good way feels#harder.|and maybe the bad way feels#easier.|but that\'s a lie.|because the bad way#takes us to the#wrong direction.|there are problems.|and we try to hide away.|but that won\'t solve#anything.|you can\'t hide forever,#because the problems#will grow.|you have to pass them#and it\'s okay to be#scared.|you can\'t hide forever,#because the problems#will grow.|you have to pass them#and it\'s okay to be#scared.|and even when you do bad#things.|you have always the#chance to reverse.|just step out of the#dark.|and fix or alleviate#what you\'ve done.|don\'t hide yourself, don\'t#live a lie.|be true to yourself and#you\'ll feel alive!|.|the end|.|the end';
var context;
var alphabet='abcdefghijklmnopqrstuvwxyz.!\', #';
var alphimg;
var alphpos =[0,4,8,11,15,18,21,25,28,31,34,37,40,45,49,53,57,61,65,69,73,77,80,85,88,91,94,95,96,97,98,100,101];
var textBegin = new Array();
var now;
var actText=0;

window.performance = window.performance || {};
performance.now = (function() {
  return performance.now       ||
         performance.mozNow    ||
         performance.msNow     ||
         performance.oNow      ||
         performance.webkitNow ||
         function() { return new Date().getTime(); };
})();

/**
 *@constructor
 */
var Text= function(){}
Text.draw = function(counter,color,y){
  var t=story.split('|')[counter];
  var letter;
  var width;
  var off=0;
  var sp;
  var sharp=0;
  for(var i=0;i<t.length;i++){
    letter=alphabet.indexOf(t[i]);
    width=alphpos[letter+1]-alphpos[letter];
    sp=Text.calcLength(t.split('#')[sharp]);
    if(t[i]==' '){
      off+=width+1;
    }else if(t[i]==','){
      drawImage(alphimg,alphpos[letter],0+(color*5),width,5,(sp+off)*4,(y+1)*4,width*4,20);
      off+=width+1;
    }else if(t[i]=='.'){
      drawImage(alphimg,alphpos[letter],0+(color*5),width,5,(sp+off)*4,y*4,width*4,20);
      off+=width+1;
      drawImage(alphimg,alphpos[letter],0+(color*5),width,5,(sp+off)*4,y*4,width*4,20);
      off+=width+1;
      drawImage(alphimg,alphpos[letter],0+(color*5),width,5,(sp+off)*4,y*4,width*4,20);
      off+=width+1;
    }else if(t[i]=='#'){
      off=0;
      y+=6;
      sharp++;
      sp=Text.calcLength(t.split('#')[sharp]);
    }else{
      drawImage(alphimg,alphpos[letter],0+(color*5),width,5,(sp+off)*4,y*4,width*4,20);
      off+=width+1;
    }
  }
};
Text.calcLength = function(t){
  var ret=0;
  for(var i=0;i<t.length;i++){
    if(t[i]!='.'){
      ret+=alphpos[alphabet.indexOf(t[i])+1]-alphpos[alphabet.indexOf(t[i])]+1;
    }
  }
  return (192-ret)/2;
}
/**
 *@constructor
 */
var Camera = function() {};
Camera.X=0;
Camera.aim=0;
Camera.calc = function(){
  Camera.X=(Camera.aim.X-80)*4;
};

/**
 *@constructor
 */
var footstep = function(){
  var X=0;
  var time=0;
}

/**
 *@constructor
 */
var Hurde = function(x,y){
  this.X=x;
  this.Y=y;
  this.size=7;
  
  this.draw=function(){
    if(actText>9 && actText<17){
      setColor(0,1);
      fillRect(this.X*4-Camera.X,(this.Y-this.size)*4,36,this.size*4);
    }
  }
};

/**
 * @constructor
 */
var Squirrel = function() {
  var footsteps=new Array(STEPS);
  var footcount=0;
  for(var i=0;i<STEPS;i++){
    footsteps[i]=new footstep();
    footsteps[i].X=0;
    footsteps[i].time=0;
  }
  this.X=-32;
  var animX=0;
  var Y=76;
  this.img=0;
  this.animImg=0;
  this.dir=0;
  var move=0;
  var frame=0;
  var nextFrame=0;
  this.mode=0;
  this.calc = function(input,s,h){
    if(this.mode==0 || this.mode==2){
      move=0;
      if(input.pressedKeys[0]){
        this.X-=0.5;
        move=1;
        this.dir=1;
        if(frame==0){
          nextFrame=now+200;
        }
      }
      if(input.pressedKeys[1] && (h.X-this.X>22||actText<10||this.mode==2)){
        if(actText==6||actText==8)
          this.X+=0.25;
        else
          this.X+=0.5;
        move=1;
        this.dir=0;
        if(frame==0){
          nextFrame=now+200;
        }
      }
      if(h.X-this.X==22 && (actText==14||actText==16) && this.mode==0){
        this.mode=1;
        frame=0;
        this.dir=0;
        nextFrame=now+100;
      }
      if(nextFrame<now){
        frame++;
        if(frame==6 || frame==4){
          this.addFootstep();
          s.step();
        }
        if(frame==2)                             
          nextFrame=now+4000;
        else if(actText==6||actText==8){
          nextFrame=now+400;
        }
        else
          nextFrame=now+200;
      }
      if(move==0){
        if(frame>1)frame=0;
      }else if(move==1){
        if(frame<2||frame>5)frame=2;
      }
    }else{
      if(nextFrame<now){
        frame++;
        nextFrame=now+100;
        if(frame==2)nextFrame+=100;
        if(frame==3){this.X++;animX++;}
        if(frame==4){this.X+=4;animX+=4;}
        if(frame==5){this.X+=5;animX+=5;}
        if(frame==6){this.X+=5;animX+=5;}
        if(frame==7){this.X+=3;animX+=3;}
        if(frame==8){this.X+=2;animX+=2;}
        if(frame>9){
          this.mode=2;
          frame=0;
          nextFrame=now+4000;
          actText=16;
        }
      }
    }
    for(var i=0;i<STEPS;i++){
      if(footsteps[i].time>0){
        footsteps[i].time--;
      }
    }
  };
  this.addFootstep = function(){
    footsteps[footcount].X=(this.X+16)*4;
    footsteps[footcount].time=150;
    footcount++;
    if(footcount>=STEPS)footcount=0;
  };
  this.draw = function(){
    var xoff = 32*frame+32*(6*this.dir);
    for(var i=0;i<STEPS;i++){
      if(footsteps[i].time>0){
        setColor(20,(1-(255-footsteps[i].time)/255));
        fillRect(footsteps[i].X-Camera.X,360,12,4);
      }
    }
    if(this.mode==0||this.mode==2)
      drawImage(this.img,xoff,0,32,16,this.X*4-Camera.X,Y*4,128,64);
    else
      drawImage(this.animImg,xoff,0,32,32,(this.X+10-animX)*4-Camera.X,(Y-17)*4,128,128);
  };
}

/**
 * @constructor
 */
var Input = function() {
  this.pressedKeys=new Array(2);
  for(var i=0;i<this.pressedKeys.length;i++){
    this.pressedKeys[i]=false;
  }
  this.mousedown=function(e){
    if(e.clientX<100){
      this.pressedKeys[0]=true;
    }
    if(e.clientX>656){
      this.pressedKeys[1]=true;
    }
  }
  this.mouseup=function(e){
    this.pressedKeys[0]=false;
    this.pressedKeys[1]=false;
  }
  this.keydown=function(e){
    this.lastPressedTime = window.performance.now();
    if(e.keyCode==37){
      this.pressedKeys[0]=true;
      e.preventDefault();
    }
    if(e.keyCode==39){
      this.pressedKeys[1]=true;
      e.preventDefault();
    }
  };
  this.keyup = function(e){
    if(e.keyCode==37){
      this.pressedKeys[0]=false;
    }
    if(e.keyCode==39){
      this.pressedKeys[1]=false;
    }
    e.preventDefault(); 
  };
  window.addEventListener('keydown',this.keydown.bind(this),false);
  window.addEventListener('keyup',this.keyup.bind(this),false);
  window.addEventListener('mousedown',this.mousedown.bind(this),false);
  window.addEventListener('mouseup',this.mouseup.bind(this),false);
}

/**
 *@constructor
 */
var Music = function(){
  var ac=new AudioContext();
  var seq1=new Sequence(ac,120,['A2 e','A3 e','A2 e','A3 e','A2 e','A3 e','A2 e','A3 e','C#3 e','C#4 e','C#3 e','C#4 e','C#3 e','C#4 e','C#3 e','C#4 e','E3 e','E4 e','E3 e','E4 e','E3 e','E4 e','E3 e','E4 e','D3 e','D4 e','D3 e','D4 e','D3 e','D4 e','D3 e','D4 e','F#3 e','F#4 e','F#3 e','F#4 e','F#3 e','F#4 e','F#3 e','F#4 e','D3 e','D4 e','D3 e','D4 e','D3 e','D4 e','D3 e','D4 e','B2 e','B3 e','B2 e','B3 e','B2 e','B3 e','B2 e','B3 e','A2 e','A3 e','A2 e','A3 e','A2 e','A3 e','A2 e','A3 e']);
  seq1.waveType='sine';
  seq1.gain.gain.value=0.125;
  var seq2=new Sequence(ac,120,['A4 q','A4 q','B4 q','A4 q','B4 q','C#5 q','C#5 e','B4 e','A4 q','C#5 h','E5 h','D5 q','C#5 q','D5 h','F#5 h','E5 h','D5 e','D5 e','E5 q','C#5 h','B4 q','C#5 q','D5 q','B4 q','A4 w']);
  seq2.waveType='triangle';
  seq2.gain.gain.value=0.125;
  var stseq=new Sequence(ac,120,['C3 s']);
  stseq.staccato=0.75;
  stseq.gain.gain.value=0.1;
  stseq.loop=false;
  stseq.waveType='square';
  this.play=function(){
    seq1.play(ac.currentTime);
    seq2.play(ac.currentTime);
  };
  this.step=function(){
    stseq.play(ac.currentTime);
  };
}

/**
 * @constructor
 */
var Game = function() {
  var color=100;
  now=window.performance.now();
  var canvas=null;
  context=null;
  input = new Input();
  var useMode=0;
  var backMusic= new Music();
  var loadedAssets=0;
  var numberOfAssets=0;
  var loaded=false;
  var squirrel=new Squirrel();
  Camera.aim=squirrel;
  var sun=null;
  var moon=null;
  var lastDir=0;
  var textColor=0;
  var invTextColor=1;
  var lastInnerWidth=0;
  var hurde=new Array();
  var hurde=new Hurde(0,91);
  
  this.preload = function(){
    canvas = document.getElementById('l');
    if(canvas.getContext){
      context=canvas.getContext('2d');
      context['mozImageSmoothingEnabled'] = false;
  	  context['imageSmoothingEnabled'] = false;
  	  context['msImageSmoothingEnabled'] = false;
  	  context['imageSmoothingEnabled'] = false;
    }
    squirrel.img=this.loadImage('s');
    squirrel.animImg=this.loadImage('o');
    sun=this.loadImage('u');
    moon=this.loadImage('m');   
    alphimg=this.loadImage('a');
    setInterval(this.update.bind(this), 1000 / 60);
  };
  
  this.loadImage = function(pfad){
    var img = new Image();
    img.onload = function(){loadedAssets+=1;};
    img.src=pfad;
    numberOfAssets++;
    return img;
  };
  
  this.update = function(){
    if(loadedAssets>=numberOfAssets){
      if(!loaded){
        backMusic.play();
        loaded=true;
      }
      now = window.performance.now();
      this.updateZoom();
      this.calc();
      this.draw();
    }
  };
  
  this.calc = function(){
    squirrel.calc(input,backMusic,hurde);
    Camera.calc();
    if(squirrel.dir==0 && color<100){
      color+=6;
      if(color>100)color=100;
    }else if(squirrel.dir==1 && color>0){
      color-=6;
      if(color<0)color=0;
    }
    if(this.setNextText()){
      if(actText==10 || actText==12 || actText==14 || actText==16)
        hurde.X=squirrel.X+48;
      if(actText==14)
        hurde.size=14;
    }
  };
  this.updateZoom = function(){
    if(lastInnerWidth!=window.innerWidth){
      lastInnerWidth=window.innerWidth;
      var zoom = (window.innerWidth-20)/1920.0;
      canvas.style.zoom=zoom;
      canvas.style.top=Math.floor((((window.innerHeight)-(zoom*1080))/2.0)/zoom)+"px";
    }
  };
  this.setNextText = function(){
    if(lastDir!=squirrel.dir){
      if(actText<story.split('|').length-1){
        if(squirrel.mode==0 && actText==16)
          actText--;
        else
          actText++;
      }else actText--;
      if(textColor==0){textColor=1;invTextColor=0;}else{textColor=0;invTextColor=1;}
      lastDir=squirrel.dir;
      return true;
    }
    return false;
  };
  this.draw = function(){
    setColor(color,1);
    fillRect(0,0,768,432);
    var siz = 2*Math.floor((now%2000)/1000);
    var y=color;
    setColor((10+color*0.8),1);
    if(actText>0){
      Text.draw(actText-1,invTextColor,10+(invTextColor*40));
    }
    Text.draw(actText,textColor,10+(textColor*40));
    drawImage(sun,0,0,30,30,624-siz+squirrel.dir*20,216-siz-y*2+squirrel.dir*20,120+siz*2-squirrel.dir*40,120+siz*2-squirrel.dir*40);
    setColor(color,(0.67-(color/150)));
    fillRect(624-siz,216-siz-y*2,120+siz*2,120+siz*2);
    drawImage(moon,0,0,21,29,50-((siz)*-1)-squirrel.dir*30,46-(siz*-1)+y*2-squirrel.dir*30,44+siz*-2+squirrel.dir*60,76+siz*-2+squirrel.dir*60);
    setColor(color,(color/200));
    fillRect(20-(siz*-1),16-(siz*-1)+y*2,84+siz*-2,116+siz*-2);
    setColor(color,1);
    fillRect(0,300,768,132);
    setColor((10+color*0.8),1);
    fillRect(0,300,768,4);
    hurde.draw();
    squirrel.draw();
  };
}
fillRect=function(x,y,w,h){
  context.fillRect(x*2.5,y*2.5,w*2.5,h*2.5);
}
drawImage=function(img,x1,y1,w1,h1,x2,y2,w2,h2){
  context.drawImage(img,x1,y1,w1,h1,x2*2.5,y2*2.5,w2*2.5,h2*2.5);
}
setColor = function(c,a){
  context.fillStyle = 'hsla(0,0%,'+c+'%,'+a+')';
}
