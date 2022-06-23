(()=>{"use strict";class t{constructor({mass:t,x:a,y:n,direction:o,pond:l}){this.palette=[[70,70,70],[226,79,24],[255,245,45],[253,230,230]];const p=Math.floor(Math.random()*this.palette.length);this.fillColor=this.getColor(p,this.palette),this.strokeColor=this.getStrokeColor(p,this.palette),this.pond=l,this.counter=0,this.mass=t||50,this.segmentLength=10,this.ripple=!1,this.velx=0,this.vely=0,this.target=null,this.targetDir=Math.PI/4+Math.PI/2;const d=o||Math.random()*Math.PI*2,g=Math.cbrt(this.mass/((5+Math.floor(Math.log(this.mass)))*Math.PI));this.mouth=new s({radius:g/2}),this.head=new i({radius:g,radian:d,prevPart:this.mouth,x:a,y:n});const c=(this.head.mass+this.mouth.mass)/this.mass;let P;this.parts=[],this.parts.push(new h({radius:g,prevPart:this.head,segmentLength:10*this.head.radius,fish:this})),this.head.setNextPart(this.parts[0]);for(let t=1;this.parts[t-1].radius>.5;t++)P=new h({radius:this.parts[t-1].radius-c,prevPart:this.parts[t-1],segmentLength:this.segmentLength,fish:this}),this.parts[t-1].setNextPart(P),this.parts.push(P);this.tail=new e(this,this.head.radius),this.fins=new r(this,this.head.radius)}getColor(t,s){const i=s[t];return`rgba(${i[0]}, ${i[1]}, ${i[2]}, 1)`}getStrokeColor(t,s){const i=s[t];return`rgba(${.8*i[0]}, ${.8*i[1]}, ${.8*i[2]}, 0.3)`}updateTargetDir(t,s){if(!this.target)return this.target=null;const i=this.target.x-this.mouth.x,h=this.target.y-this.mouth.y;0===i&&(h<0&&(this.targetDir=3*Math.PI/2),this.targetDir=Math.PI/2);const e=Math.atan(h/i);this.targetDir=i>0?e:-Math.PI+e}foodNotify(t){this.target&&t.getDistance(this.mouth.x,this.mouth.y)<this.target.getDistance(this.mouth.x,this.mouth.y)?this.target=t:this.target||(this.target=t)}feed(t){this.ripple=!0,this.updateMass(this.mass+t),this.change()}change(){if(this.counter++,this.counter>1){this.counter=0;const t=3*Math.random();t<1?this.tail.change():(t<2||this.tail.change(),this.fins.change())}}updateMass(t){this.mass=t>50?t:50;const s=Math.cbrt(this.mass/((5+Math.floor(Math.log(this.mass)))*Math.PI));this.mouth.updateRadius(s/2),this.head.updateRadius(s),this.parts[0].updateRadius(s,this);const i=(this.head.mass+this.mouth.mass)/this.mass;let e;for(let t=1;this.parts[t-1].radius>.5;t++)this.parts[t]?this.parts[t].updateRadius(this.parts[t-1].radius-i,this):(e=new h({radius:this.parts[t-1].radius-i,prevPart:this.parts[t-1],segmentLength:this.segmentLength,fish:this}),this.parts[t-1].setNextPart(e),this.parts.push(e));this.tail.updateRadius(this.head.radius),this.fins.updateRadius(this.head.radius)}render(t){if(this.target)if(0===this.target.value){let t=this.pond.getClosestFood();t&&(this.target=t)}else this.target.value<0&&(this.target=this.pond.getClosestFood(),null===this.target&&(this.target=this.pond.getSpot(this.mouth.x,this.mouth.y)));else this.target=this.pond.getClosestFood(this.mouth.x,this.mouth.y),this.target||(this.target=this.pond.getSpot());this.updateTargetDir(),this.newvelx=0,this.newvely=0,this.parts[0].act(this),this.velx*=.97,this.vely*=.97,this.move(this.newvelx+this.velx,this.newvely+this.vely),this.pond.bite(this.mouth.x,this.mouth.y,this.mouth.radius,this),this.drawFish(t),this.ripple&&this.pond.ripple(this.mouth.x,this.mouth.y,10*this.head.radius),this.ripple=!1}drawFish(t){let s;for(this.fins.render(t),t.fillStyle=this.fillColor,t.beginPath(),t.moveTo(...this.head.getPoint(8*this.head.radius,Math.PI/2)),s=0;s<this.parts.length-1;s++)t.lineTo(...this.parts[s].getPoint(8*this.parts[s].radius,Math.PI/2));for(t.lineTo(...this.parts[this.parts.length-1].getPoint(0,0)),s=this.parts.length-2;s>-1;s--)t.lineTo(...this.parts[s].getPoint(8*this.parts[s].radius,-Math.PI/2));for(t.lineTo(...this.head.getPoint(8*this.head.radius,-Math.PI/2)),t.fill(),t.closePath(),t.beginPath(),t.moveTo(...this.head.getPoint(8*this.head.radius,Math.PI/2+.1)),t.lineTo(...this.head.getPoint(9*this.head.radius,Math.PI/3)),t.lineTo(...this.head.getPoint(10.5*this.head.radius,Math.PI/5)),t.lineTo(...this.head.getPoint(11*this.head.radius,Math.PI/6)),t.quadraticCurveTo(...this.head.getPoint(20*this.head.radius,0),...this.head.getPoint(11*this.head.radius,-Math.PI/6)),t.lineTo(...this.head.getPoint(10.5*this.head.radius,-Math.PI/5)),t.lineTo(...this.head.getPoint(9*this.head.radius,-Math.PI/3)),t.lineTo(...this.head.getPoint(8*this.head.radius,-Math.PI/2-.1)),t.fill(),t.closePath(),this.tail.render(t),t.fillStyle=this.strokeColor.replace("0.3)","1)"),t.beginPath(),t.moveTo(...this.parts[Math.floor(this.parts.length/5)].getPoint(0,0)),s=Math.floor(this.parts.length/5)+1;s<Math.floor(3*this.parts.length/4)+1;s++)t.lineTo(...this.parts[s].getPoint(2*this.parts[s].radius,Math.PI/2));for(t.lineTo(...this.parts[Math.floor(3*this.parts.length/4)].getPoint(0,0)),s=Math.floor(3*this.parts.length/4)+1;s>Math.floor(this.parts.length/5);s--)t.lineTo(...this.parts[s].getPoint(2*this.parts[s].radius,-Math.PI/2));t.fill(),t.closePath()}move(t,s){this.head.move(t,s)}}class s{constructor({radius:t}){this.x=null,this.y=null,this.radius=t,this.mass=4*Math.PI/3*Math.pow(this.radius,3)}updateRadius(t){this.radius=t,this.mass=4*Math.PI/3*Math.pow(this.radius,3)}}class i{constructor({radius:t,radian:s,prevPart:i,x:h,y:e}){this.x=h,this.y=e,this.radian=s,this.radius=t,this.mass=4*Math.PI/3*Math.pow(this.radius,3),this.prevPart=i,this.prevPart.x=this.x+1.3*this.radius*10*Math.cos(this.radian),this.prevPart.y=this.y+1.3*this.radius*10*Math.sin(this.radian),this.nextPart=null}setNextPart(t){return null===this.nextPart&&(this.nextPart=t,!0)}updateRadius(t){this.radius=t,this.mass=4*Math.PI/3*Math.pow(this.radius,3)}getPoint(t,s){return[this.x+t*Math.cos(s+this.radian),this.y+t*Math.sin(s+this.radian)]}move(t,s){this.nextPart.move(t,s),this.radian=this.nextPart.radian,this.x=this.nextPart.x+10*this.radius*Math.cos(this.radian),this.y=this.nextPart.y+10*this.radius*Math.sin(this.radian),this.prevPart.x=this.x+1.3*this.radius*10*Math.cos(this.radian),this.prevPart.y=this.y+1.3*this.radius*10*Math.sin(this.radian)}}class h{constructor({radius:t,prevPart:s,segmentLength:i,fish:h}){this.prevPart=s,this.segmentLength=i,this.nextPart=null,this.commitMove=0,this.dirCount=0,this.x=this.prevPart.x+this.segmentLength*Math.cos(this.prevPart.radian+Math.PI),this.y=this.prevPart.y+this.segmentLength*Math.sin(this.prevPart.radian+Math.PI),this.atTarget=null,this.radius=t,this.mass=4*Math.PI/3*Math.pow(this.radius,3),this.maxAngle=Math.PI/Math.pow(Math.log(h.mass),1.1),this.maxAngle=this.radius*this.radius/this.mass*this.maxAngle,this.moveAngle=this.maxAngle/3,this.commitMax=3+Math.floor(Math.pow(h.mass,.4)),this.updateRadian()}updateRadian(){const t=this.prevPart.x-this.x,s=this.prevPart.y-this.y;0===t&&(s<0&&(this.radian=3*Math.PI/2),this.radian=Math.PI/2);const i=Math.atan(s/t);this.radian=t>0?i:-Math.PI+i}setNextPart(t){return null===this.nextPart&&(this.nextPart=t,!0)}updateRadius(t,s){this.radius=t,this.mass=4*Math.PI/3*Math.pow(this.radius,3),this.maxAngle=Math.PI/Math.pow(Math.log(s.mass),1),this.maxAngle=this.radius*this.radius/this.mass*this.maxAngle,this.moveAngle=this.maxAngle/3,this.commitMax=1+Math.floor(Math.pow(s.mass,1/2.7)),this.updateRadian()}rotate(t){const s=Math.sin(t),i=Math.cos(t),h=this.x-this.prevPart.x,e=this.y-this.prevPart.y;this.x=h*i-e*s+this.prevPart.x,this.y=h*s+e*i+this.prevPart.y}act(t){let s=this.x,i=this.y;this.updateRadian();let h=this.radian-this.prevPart.radian;if(h>Math.PI?h-=2*Math.PI:h<-Math.PI&&(h+=2*Math.PI),Math.abs(h)>this.maxAngle)if(this.commitMove=0,h>0)if(h-this.maxAngle>2*this.moveAngle){const t=this.prevPart.radian+Math.PI+.8*this.maxAngle;this.x=this.prevPart.x+this.segmentLength*Math.cos(t),this.y=this.prevPart.y+this.segmentLength*Math.sin(t)}else this.x=this.prevPart.x+this.segmentLength*Math.cos(this.radian+Math.PI),this.y=this.prevPart.y+this.segmentLength*Math.sin(this.radian+Math.PI),this.rotate(-this.moveAngle);else if(h+this.maxAngle<2*-this.moveAngle){const t=this.prevPart.radian+Math.PI-.8*this.maxAngle;this.x=this.prevPart.x+this.segmentLength*Math.cos(t),this.y=this.prevPart.y+this.segmentLength*Math.sin(t)}else this.x=this.prevPart.x+this.segmentLength*Math.cos(this.radian+Math.PI),this.y=this.prevPart.y+this.segmentLength*Math.sin(this.radian+Math.PI),this.rotate(this.moveAngle);else this.x=this.prevPart.x+this.segmentLength*Math.cos(this.radian+Math.PI),this.y=this.prevPart.y+this.segmentLength*Math.sin(this.radian+Math.PI),h=this.radian-t.targetDir,h>Math.PI?h-=2*Math.PI:h<-Math.PI&&(h+=2*Math.PI),this.commitMove<0?(this.rotate(-this.moveAngle),this.commitMove+=1):this.commitMove>0?(this.rotate(this.moveAngle),this.commitMove-=1):h>0?(h<.1&&(this.commitMove=-this.commitMax),this.rotate(-this.moveAngle),this.dirCount>2*this.commitMax?(this.commitMove=1+Math.floor(this.commitMax/3),this.dirCount=0):this.dirCount>0?this.dirCount++:this.dirCount=1):(h>-.1&&(this.commitMove=this.commitMax),this.rotate(this.moveAngle),this.dirCount<-2*this.commitMax?(this.commitMove=-1-Math.floor(this.commitMax/3),this.dirCount=0):this.dirCount<0?this.dirCount--:this.dirCount=-1);if(this.updateRadian(),this.nextPart){const h=this.mass/t.mass;t.newvelx+=(s-this.x)*h,t.newvely+=(i-this.y)*h,this.nextPart.act(t)}else{let h=0;t.target&&t.target.getDistance(t.mouth.x,t.mouth.y)>300&&(h=5/t.mass*(1-50/t.target.getDistance(t.mouth.x,t.mouth.y)));let e=t.parts[0].radian-t.targetDir;e>Math.PI?e-=2*Math.PI:e<-Math.PI&&(e+=2*Math.PI);const a=this.mass/t.mass,r=s-this.x,n=i-this.y;t.newvelx+=r*a,t.newvely+=n*a,this.atTarget=Math.pow(1-2*Math.abs(e)/Math.PI,3)+5*h;const o=Math.sqrt(r*r+n*n);t.velx+=o*Math.cos(t.parts[0].radian)/10*this.atTarget,t.vely+=o*Math.sin(t.parts[0].radian)/10*this.atTarget}}move(t,s){this.x+=t,this.y+=s,this.nextPart&&this.nextPart.move(t,s)}getPoint(t,s){return[this.x+t*Math.cos(s+this.radian),this.y+t*Math.sin(s+this.radian)]}}class e{constructor(t,s){this.changeCount=0,this.fish=t,this.pieces=[[],[],[],[],[]],this.radius=s,this.fillColor=this.fish.fillColor,this.strokeColor=this.fish.strokeColor,this.pieceLength=2*this.radius,this.tip=t.parts[this.fish.parts.length-1],this.maxAngle=this.tip.maxAngle;for(let t=0;t<3;t++)this.pieces[2].push(new a(this,this.pieces[2][t-1],0));for(let t=0;t<5;t++)this.pieces[1].push(new a(this,this.pieces[1][t-1],1));for(let t=0;t<8;t++)this.pieces[0].push(new a(this,this.pieces[0][t-1],2));for(let t=0;t<5;t++)this.pieces[3].push(new a(this,this.pieces[3][t-1],-1));for(let t=0;t<8;t++)this.pieces[4].push(new a(this,this.pieces[4][t-1],-2))}change(){const t=3*Math.random();t<1?this.pieces[2].push(new a(this,this.pieces[2][this.pieces[2].length-1],0)):t<2?(this.pieces[1].push(new a(this,this.pieces[1][this.pieces[1].length-1],1)),this.pieces[3].push(new a(this,this.pieces[3][this.pieces[3].length-1],-1))):(this.pieces[0].push(new a(this,this.pieces[0][this.pieces[0].length-1],2)),this.pieces[4].push(new a(this,this.pieces[4][this.pieces[4].length-1],-2)))}updateRadius(t){this.radius=t,this.pieceLength=2*this.radius,this.tip=this.fish.parts[this.fish.parts.length-1],this.maxAngle=this.tip.maxAngle;for(let t=0;t<5;t++)this.pieces[t][0].prevPart=this.tip}act(){this.tip=this.fish.parts[this.fish.parts.length-1];for(let t=0;t<this.pieces[2].length;t++)this.pieces[2][t].act(this);for(let t=0;t<this.pieces[1].length;t++)this.pieces[1][t].act(this);for(let t=0;t<this.pieces[0].length;t++)this.pieces[0][t].act(this);for(let t=0;t<this.pieces[3].length;t++)this.pieces[3][t].act(this);for(let t=0;t<this.pieces[4].length;t++)this.pieces[4][t].act(this)}render(t){this.act(),t.fillStyle=this.fillColor;for(let s=0;s<this.pieces.length-1;s++){t.beginPath(),t.moveTo(...this.tip.getPoint(0,0));for(let i=0;i<this.pieces[s].length;i++)t.lineTo(this.pieces[s][i].x,this.pieces[s][i].y);for(let i=this.pieces[s+1].length-1;i>-1;i--)t.lineTo(this.pieces[s+1][i].x,this.pieces[s+1][i].y);t.fill(),t.closePath()}t.strokeStyle=this.strokeColor,t.lineWidth=1;for(let s=0;s<this.pieces.length;s++){t.beginPath(),t.moveTo(...this.tip.getPoint(0,0));for(let i=0;i<this.pieces[s].length;i++)t.lineTo(this.pieces[s][i].x,this.pieces[s][i].y);t.stroke(),t.closePath()}}}class a{constructor(t,s,i){this.prevPart=s,this.offset=i,this.velx=0,this.vely=0,this.x=null,this.y=null,this.prevPart||(this.prevPart=t.tip),this.radian=this.prevPart.radian,this.maxAngle=this.prevPart.maxAngle,[this.x,this.y]=this.prevPart.getPoint(t.pieceLength,this.prevPart.radian+Math.PI)}act(t){let s=this.x,i=this.y;this.x+=this.velx,this.y+=this.vely,this.updateRadian();let h=this.radian+this.offset/3-this.prevPart.radian;if(h>Math.PI?h-=2*Math.PI:h<-Math.PI&&(h+=2*Math.PI),Math.abs(h)>t.maxAngle)if(h>0)if(h-t.maxAngle>t.maxAngle/2){const s=this.prevPart.radian+Math.PI+t.maxAngle;this.x=this.prevPart.x+t.pieceLength*Math.cos(s),this.y=this.prevPart.y+t.pieceLength*Math.sin(s)}else this.x=this.prevPart.x+t.pieceLength*Math.cos(this.radian+Math.PI),this.y=this.prevPart.y+t.pieceLength*Math.sin(this.radian+Math.PI);else if(h+t.maxAngle<-t.maxAngle/2){const s=this.prevPart.radian+Math.PI-t.maxAngle;this.x=this.prevPart.x+t.pieceLength*Math.cos(s),this.y=this.prevPart.y+t.pieceLength*Math.sin(s)}else this.x=this.prevPart.x+t.pieceLength*Math.cos(this.radian+Math.PI),this.y=this.prevPart.y+t.pieceLength*Math.sin(this.radian+Math.PI);else this.x=this.prevPart.x+t.pieceLength*Math.cos(this.radian+Math.PI),this.y=this.prevPart.y+t.pieceLength*Math.sin(this.radian+Math.PI);this.velx=(this.velx+this.x-s)/5,this.vely=(this.vely+this.y-i)/5}rotate(t){const s=Math.sin(t),i=Math.cos(t),h=this.x-this.prevPart.x,e=this.y-this.prevPart.y;this.x=h*i-e*s+this.prevPart.x,this.y=h*s+e*i+this.prevPart.y}updateRadian(){const t=this.prevPart.x-this.x,s=this.prevPart.y-this.y;0===t&&(s<0&&(this.radian=3*Math.PI/2),this.radian=Math.PI/2);const i=Math.atan(s/t);this.radian=t>0?i:-Math.PI+i}getPoint(t,s){return[this.x+t*Math.cos(s+this.radian),this.y+t*Math.sin(s+this.radian)]}}class r{constructor(t,s){this.fish=t,this.fins=[new n(t,1,0,s),new n(t,-1,0,s),new n(t,1,.3,s),new n(t,-1,.3,s)],this.radius=s,this.tip=t.parts[this.fish.parts.length-1],this.maxAngle=this.tip.maxAngle}updateRadius(t){for(let s=0;s<this.fins.length;s++)this.fins[s].updateRadius(t)}change(){const t=2*Math.random();t>1?(this.fins[0].change(t/2),this.fins[1].change(t/2)):(this.fins[2].change(t/2),this.fins[3].change(t/2))}act(){for(let t=0;t<this.fins.length;t++)this.fins[t].act()}render(t){this.act();for(let s=0;s<this.fins.length;s++)this.fins[s].render(t)}}class n{constructor(t,s,i,h){this.fish=t,this.side=s,this.ratio=i,this.radius=h,this.part=t.parts[Math.floor(t.parts.length*i)],this.pieceLength=3*this.radius+1,this.fillColor=this.fish.fillColor.replace("1)","0.4)"),this.strokeColor=this.fish.strokeColor,this.pieces=[[new o(this,void 0,this.side,0)],[new o(this,void 0,this.side,1)],[new o(this,void 0,this.side,2)],[new o(this,void 0,this.side,3)],[new o(this,void 0,this.side,4)],[new o(this,void 0,this.side,5)],[new o(this,void 0,this.side,6)]];for(let t=0;t<7;t++)for(let s=0;s<5-t/2;s++)this.pieces[t].push(new o(this,this.pieces[t][s],this.side,t))}updateRadius(t){this.radius=t,this.pieceLength=3*this.radius+1,this.part=this.fish.parts[Math.floor(this.fish.parts.length*this.ratio)]}change(t){const s=Math.floor(t*this.pieces.length),i=this.pieces[s][this.pieces[s].length-1];this.pieces[s].push(new o(this,i,this.side,s))}act(){for(let t=0;t<this.pieces.length;t++)for(let s=0;s<this.pieces[t].length;s++)this.pieces[t][s].act()}render(t){t.fillStyle=this.fillColor;for(let s=0;s<this.pieces.length-1;s++){t.beginPath(),t.moveTo(this.pieces[s][0].x,this.pieces[s][0].y);for(let i=1;i<this.pieces[s].length;i++)t.lineTo(this.pieces[s][i].x,this.pieces[s][i].y);for(let i=this.pieces[s+1].length-1;i>-1;i--)t.lineTo(this.pieces[s+1][i].x,this.pieces[s+1][i].y);t.fill(),t.closePath()}t.strokeStyle=this.strokeColor,t.lineWidth=1;for(let s=0;s<this.pieces.length;s++){t.beginPath(),t.moveTo(this.pieces[s][0].x,this.pieces[s][0].y);for(let i=1;i<this.pieces[s].length;i++)t.lineTo(this.pieces[s][i].x,this.pieces[s][i].y);t.stroke(),t.closePath()}}}class o{constructor(t,s,i,h){this.fin=t,this.prevPart=s,this.side=i,this.finOffset=-this.side*(.3*(1-this.fin.ratio)-5*this.fin.ratio),this.bias=i*h*Math.PI/8,this.velx=0,this.vely=0,this.x=null,this.y=null,this.radian=null,this.maxAngle=null,this.prevPart?(this.maxAngle=this.prevPart.maxAngle,this.radian=this.prevPart.radian,[this.x,this.y]=this.prevPart.getPoint(this.fin.pieceLength,Math.PI)):([this.x,this.y]=this.fin.part.getPoint(9*this.fin.part.radius,this.side*Math.PI/2+this.finOffset),this.maxAngle=this.fin.part.maxAngle*this.fin.ratio,this.radian=this.fin.part.radian+Math.PI/2*-this.side+this.finOffset/2+this.bias)}act(){if(this.prevPart){this.maxAngle=this.prevPart.maxAngle;let t=this.x,s=this.y;this.x+=this.velx,this.y+=this.vely,this.updateRadian();let i=this.radian-this.prevPart.radian;i>Math.PI?i-=2*Math.PI:i<-Math.PI&&(i+=2*Math.PI),i>0?i>this.maxAngle?[this.x,this.y]=this.prevPart.getPoint(this.fin.pieceLength,Math.PI+this.maxAngle):(this.x=this.prevPart.x+this.fin.pieceLength*Math.cos(this.radian+Math.PI),this.y=this.prevPart.y+this.fin.pieceLength*Math.sin(this.radian+Math.PI)):i<-this.maxAngle?[this.x,this.y]=this.prevPart.getPoint(this.fin.pieceLength,Math.PI-this.maxAngle):(this.x=this.prevPart.x+this.fin.pieceLength*Math.cos(this.radian+Math.PI),this.y=this.prevPart.y+this.fin.pieceLength*Math.sin(this.radian+Math.PI)),this.velx=(this.velx+this.x-t)/5,this.vely=(this.vely+this.y-s)/5}else[this.x,this.y]=this.fin.part.getPoint(9*this.fin.part.radius,this.side*Math.PI/2+this.finOffset),this.maxAngle=this.fin.part.maxAngle*this.fin.ratio,this.radian=this.fin.part.radian+Math.PI/2*-this.side+this.finOffset/2+this.bias}updateRadian(){const t=this.prevPart.x-this.x,s=this.prevPart.y-this.y;0===t&&(s<0&&(this.radian=3*Math.PI/2),this.radian=Math.PI/2);const i=Math.atan(s/t);this.radian=t>0?i:-Math.PI+i}getPoint(t,s){return[this.x+t*Math.cos(s+this.radian),this.y+t*Math.sin(s+this.radian)]}}class l{constructor(t,s,i,h){this.value=i,this.x=t,this.y=s,this.nextSpot=h}getDistance(t,s){const i=this.x-t,h=this.y-s;return Math.sqrt(i*i+h*h)}eaten(t){0===this.value&&this==t.target?t.target=this.nextSpot:this.value>0&&(t.target=null,t.feed(this.value),this.value=-1)}}class p extends l{constructor(t,s,i,h){super(t,s,i,h),this.palette=["rgb(212, 168, 72)","rgb(123, 101, 57)","rgb(212, 112, 46)","rgb(169, 155, 60)"],this.color=this.getColor(this.palette)}getColor(t){return t[Math.floor(Math.random()*t.length)]}render(t){this.value>0&&(t.fillStyle=this.color,t.beginPath(),t.arc(this.x,this.y,3,0,2*Math.PI,!0),t.fill(),t.closePath())}}class d{constructor(t,s,i,h,e){this.x=t,this.y=s,this.size=i,this.pond=h,this.index=e,this.opacity=1,this.ops=this.opacity/i/4,this.lineWidth=1,this.radius=1}render(t){t.strokeStyle=`rgba(235,235,235,${this.opacity})`,t.lineWidth=this.lineWidth,t.beginPath(),t.arc(this.x,this.y,3*Math.sqrt(this.radius),0,2*Math.PI,!0),t.stroke(),t.closePath(),this.opacity<0&&this.pond.ripples.splice(this.indx,1),this.opacity-=this.ops,this.lineWidth+=.1,this.radius++}}const g=document.getElementsByTagName("canvas")[0];let c=new class{constructor(t){this.var=.001,this.instructions=!0,this.opacity=.8,this.ops=this.opacity/60,this.maxFood=100,this.window=t,this.height=parseInt(document.querySelector("header").clientHeight),this.width=this.window.innerWidth,console.log(this.height,this.width),this.vh=this.height/100,this.vw=this.width/100,this.c=0,this.spots=[new l(0,0,0)];for(let t=1;t<100;t++)this.spots.push(new l(0,0,0,this.spots[t-1]));this.spots[0].nextSpot=this.spots[this.spots.length-1];const s=this.height/2,i=this.width/2;for(let t=0;t<this.spots.length;t++)this.spots[t].x=i+Math.random()*i*3*Math.cos(t),this.spots[t].y=s+Math.random()*s*3*Math.sin(t);this.foods=[],this.ripples=[],this.fish=[],this.fishCount=10,t.setInterval(this.addRemainingFish.bind(this),3e3)}addRemainingFish(){this.fish.length<this.fishCount&&this.addFish()}start(t){const s=t.getContext("2d"),i=()=>{const h=this.height,e=this.width;if(this.height=parseInt(document.querySelector("header").clientHeight),this.width=this.window.innerWidth,t.height=this.height,t.width=this.width,this.vh=this.height/100,this.vw=this.width/100,e!==this.width||h!==this.height){const t=this.height/2,s=this.width/2;for(let i=0;i<this.spots.length;i++)this.spots[i].x=s+Math.random()*s*3*Math.cos(i),this.spots[i].y=t+Math.random()*t*3*Math.sin(i)}this.render(s),setTimeout(i,1e3/30)};i()}render(t){this.fish.sort(((t,s)=>s.mass-t.mass));for(let s=0;s<this.fish.length;s++)this.fish[s].render(t);for(let s=0;s<this.ripples.length;s++)this.ripples[s].render(t);for(let s=0;s<this.foods.length;s++)this.foods[s].render(t)}click(t,s){this.instructions=!1;let i=new p(t,s,3);if(this.opacity<.2&&t>0&&s>this.height-4*this.vh-.5*this.fontSize&&t<4*this.vh+this.textWidth&&s<this.height-4*this.vh-.5*this.fontSize+.5*this.fontSize+4*this.vh)this.addFish(),this.var+=.001;else{this.foods.length<this.maxFood||(this.foods[0].value=-1,this.foods.shift()),this.foods.push(i);for(let t=0;t<this.fish.length;t++)this.fish[t].foodNotify(i)}}addFish(){let s,i,h,e=2*Math.random();e>1?(i=this.height/2,e=2*Math.random(),e>1?(s=-50,h=1e-4):(s=50+this.width,h=Math.PI)):(e=2*Math.random(),s=this.width/2,e>1?(i=-100,h=Math.PI/2):(i=this.height+100,h=Math.PI/2*3)),this.fish.push(new t({mass:35+Math.sqrt(1e4*Math.random())+this.var,x:s,y:i,pond:this,direction:h}))}getClosestFood(t,s){if(this.foods.length<1)return null;let i=this.foods[0];for(let h=1;h<this.foods.length;h++)this.foods[h].getDistance(t,s)<i.getDistance(t,s)&&(i=this.foods[h]);return i}getSpot(){return this.spots[Math.floor(this.spots.length*Math.random())]}bite(t,s,i,h){for(let e=0;e<this.foods.length;e++)this.foods[e].getDistance(t,s)<i+10&&(this.foods[e].eaten(h),this.foods.splice(e,1),e--);if(h.target&&0===h.target.value)for(let i=0;i<this.spots.length;i++)this.spots[i].getDistance(t,s)<200&&this.spots[i].eaten(h)}ripple(t,s,i){this.ripples.push(new d(t,s,i,this,this.ripples.length))}}(window);g.addEventListener("click",(function(t){const s=t.clientX-g.offsetLeft,i=t.clientY-g.offsetTop;c.click(s,i)})),c.start(g)})();