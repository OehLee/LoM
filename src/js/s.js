var Paths = {};
var mapw = 1000;
var maph = 1000;

var nameson = false;

for (i in Locs){
	Locs[i].pop = 100;
	Locs[i].builds = [
		['Merchant',1],
		['Hostel',1],
		['Temple',1]
	]
}

var market_items = {
'sword' : {
price : 10
},
'hammer' : {
price : 15
},
'bow' : {
price : 10
}

}

var Worldstats = {
	time : {
		min : 0,
		hour : 7,
		day : 1,
		month : 1,
		year : 1
	}
}

function calcTime(){
while (Worldstats.time.min > 59){
Worldstats.time.min -= 60;
Worldstats.time.hour += 1;
}
while (Worldstats.time.hour > 23){
Worldstats.time.hour -= 24;
Worldstats.time.day += 1;
}

drawClock();
}


var movetime = 750;
var Player = {
	name : 'Heros von Göttersleben',
	lvl : 12,
	exp : 75,	
	
	// Attributes
	
	// Inventory
	
	gold : 100,
	items : ['sword','bottle of water'],
	
	// Current Position on Map (Tile ID)
	p : 1
};

drawBody();

function drawBody(){
	var c = '';

	c+='<div class="mapcont">';
		c+='<div class="map"></div>';
	c+='</div>';
	
	c+='<div class="mapcontrols">'

	c+='</div>';
	
	c+='<div class="playerstats"></div>';
	c+='<div class="history"></div>';
	c+='<div class="help"></div>';	
	c+='<div class="clock"></div>';	
	$('body').html(c);	
	
	drawMap();	
	drawPlayerStats();
	drawClock();	
	EnterTile();
	drawHelp();
}
function drawClock(){
var c = '';
c+= Worldstats.time.hour + ':' + Worldstats.time.min + '<br>';
c+= Worldstats.time.day + '.' +Worldstats.time.month + '.' + Worldstats.time.year + '<br>';
$('.clock','body').html(c);

}

function drawPlayerStats(){
var c = '';

$('.playerstats','body').html(c);
}

function drawMap(){
	var c = '';
	for (i in Locs){
		var ts = 'top:' + Locs[i].y + 'px;left:'+Locs[i].x+'px;background:url(src/style/img/tiles/'+Locs[i].type+'.png)';
		
		c+='<div id="'+i+'" class="loc" style="'+ts+'">';
		
		if (i != Player.p){
		c+='<div class="name">'+Locs[i].name+'</div>';
		}else{
		c+='<div class="name actname">'+Locs[i].name+'</div>';
		}
		c+='</div>';
	}	
	c+='<canvas id="paths" width="'+mapw+'" height="'+maph+'"></canvas>';
	c+='<div class="player"><img src="src/style/img/tiles/player.png"></div>';	
	$('.map','body').html(c);
	$('.map','body').css('height',maph+'px');
	$('.map','body').css('width',mapw+'px');
	//$('.map').draggable();	
	var tp = $('#'+Player.p,'.map').position();
	$('.player','.map').css('top', tp.top + 'px');
	$('.player','.map').css('left', tp.left + 'px');
	
	$('.name:not(.actname)','.loc').addClass('hidname');
	
	
	constructPaths();
	function constructPaths(){		
		for (i in Locs){
			for (j in Locs[i].con){
				var ps = i;
				var pt = Locs[i].con[j];					
				var exists = false;
				var pal = 0;
				for (k in Paths){
					pal++;
					var eps = Math.min(Paths[k].con[0],Paths[k].con[1]);
					var ept = Math.max(Paths[k].con[0],Paths[k].con[1]);
					if (eps == Math.min(ps,pt) && ept == Math.max(ps,pt)){
						exists = true;
					}
				}			
				if (exists == false){
					
					Paths[pal] = {
						con : [Math.min(ps,pt),Math.max(ps,pt)],
						nodes : {}
					}
				}
			}
		}			
		for (i in Paths){
			var s = Paths[i].con[0];
			var t = Paths[i].con[1];
			var sx = Locs[s].x;
			var sy = Locs[s].y;
			var tx = Locs[t].x;
			var ty = Locs[t].y;			
			var lx = tx-sx;
			var ly = ty-sy;			
			if (lx < 0){
			lx = lx*-1;
			}
			if (ly < 0){
			ly = ly*-1;
			}			
			var len = Math.ceil(Math.sqrt(Math.pow(lx,2) + Math.pow(ly,2)));			
			var pn = Math.ceil(len/10);			
			var pdev = Math.ceil(len/35);			
			for (var j=0;j<pn+1;j++){
				Paths[i].nodes[j] = {
					x : Math.floor(sx+(j*((tx-sx)/pn))),
					y : Math.floor(sy+(j*((ty-sy)/pn)))
				}					
				if (j > 0){
					Paths[i].nodes[j].x += Math.floor((-pdev/2)+(Math.random()*pdev));
					Paths[i].nodes[j].y += Math.floor((-pdev/2)+(Math.random()*pdev));				
				}
				if (j == pn){
					Paths[i].nodes[j].x = tx;
					Paths[i].nodes[j].y = ty;				
				}				
			}			
			graph = $('canvas','.map');
			var c = graph[0].getContext('2d');
			c.lineWidth = 1;
			c.lineCap='round';
			c.lineJoin='round';
			c.strokeStyle = '#000';
			c.shadowColor= '#000';			
			c.shadowBlur=0;
			c.shadowOffsetX=0;
			c.shadowOffsetY=0;	
			c.setLineDash([5,5]);
			c.beginPath();	
			for (var j in Paths[i].nodes){	
			
				var nx = Paths[i].nodes[j].x;
				var ny = Paths[i].nodes[j].y;
				c.lineTo(nx, ny);
			
			}
			c.stroke();	
			c.closePath();				
		}		
	}






	
	initPlayerMovement();
	posMap();
}
function posMap(){
	$('.map','.mapcont').draggable( "destroy" );
	$('.loc','.map').off();
	var pp = Player.p;
	var ptp = $('#' + Player.p,'.map').position();
	var ptx = ptp.left;
	var pty = ptp.top;
	var winh = $(window).height();
	var winw = $(window).width();

	var mty = 0//(-(pty)+(winh/2));
	if (pty > winh/2){
	mty = (-(pty)+(winh/2));
	}
	var mtx = 0//(-(ptx)+(winw/2));
	$('.map','.mapcont').animate({
		top : mty + 'px',
		left: mtx + 'px'
	},movetime,'linear',function(){
	initPlayerMovement();
	});
	
};
function initPlayerMovement(){
	posPlayer();
	$('.loc','.map').on('click',function(){
	
		
		var pp = Player.p;
		var tid = parseInt($(this).attr('id'));
		var iscon = false;
		var rev = false;
	
		for (i in Locs[pp].con){		
			if (tid == Locs[pp].con[i]){
				iscon = true;						
			}		
		}
	
		if (iscon == true){	
			$('.loc','.map').off();
			for (i in Paths){
			var eps = Paths[i].con[0];
			var ept = Paths[i].con[1];
			if (eps == pp && ept == tid){
			pid = i;
			rev = false;
			}
			if (eps == tid && ept == pp){
			pid = i;
			rev = true;
			}
			
			}
			Player.p = tid;
			movePlayer(pid,rev);
			
		}else{
	
		}
		
	});

	
	$('.map','.mapcont').draggable({
		distance: 25,
		stop: function() {
		//posMap();
		}
	});
	$('.mapcont','body').on('dblclick',function(){
	posMap();
	});
	function movePlayer(tarl,isreverse){
		
		posMap();
		var tp = tarl;		
		
		var ni = 0;
		var nl = 0;			

		for (i in Paths[tp].nodes){
			nl++;
		}
		
		if (isreverse == true){
		ni = nl-1;
		
		}			

		movePlayerToNode();
		function movePlayerToNode(){
			Worldstats.time.min += 30;
			calcTime();
			var nx = Paths[tp].nodes[ni].x;
			var ny = Paths[tp].nodes[ni].y;
			
			$('.player','.map').animate({
				top : ny + 'px',
				left : nx + 'px'
			},Math.round((movetime*(1+Math.random()))/nl),'linear',function(){
		
				if (isreverse == true){
					ni--;
					if (ni > -1){		
						movePlayerToNode();
					}else{					
							 posPlayer()
							EnterTile();
					}					
				}else{	
					ni++;		
					if (ni < nl){		
						movePlayerToNode();
					}else{		
							 posPlayer()
							EnterTile();				
					}
				}
					
			})
			
		}
			
	}
}
function posPlayer(){
	
	
	$('.loc','.map').find('.name').removeClass('actname',100);	
	$('#' + Player.p,'.map').find('.name').addClass('actname',100);
	
	
		
}
function EnterTile(){
writeHistoryLog('You arrived in ' + Locs[Player.p].name);
var c = '';
c+='<div class="loc_display">';

c+='<div class="header">'+Locs[Player.p].name+'</div>';
c+= GenSC(Locs[Player.p].seed,'pop'); + '<br>'




c+='<div class="exit">Exit</div>';
c+='</div>';
$('body').append(c);



$('.build','.locview').on ('click',function(){
var c = '';
for (i in market_items){
c+='<div class="item"><div class="name">' + i + '</div><div class="price">' + market_items[i].price + '</div><div class="buyit"></div></div>'; 
}

$('.build_content','.loc_display').html(c);
});


$('.exit','.loc_display').on('click',function(){
$('.exit','.loc_display').off();
exitLoc();
});

function exitLoc(){
$('.loc_display','body').animate({opacity:0},750,function(){$('.loc_display','body').remove()});
initPlayerMovement();
}

$('.loc_display','body').animate({opacity:1},750);

}

function GenSC(seed,type){
var op = '';

//Pop

//Type

//market


return op;
}

function writeHistoryLog(txt){
var logtime = '[' + Worldstats.time.day + '.' + Worldstats.time.month + '.' + Worldstats.time.year + '] ';
var c = logtime + '"' + txt + '"<br>';
$('.history','body').append(c);


}


function drawHelp(){
var c = '<div>';

c+='# hover over locations to see name <br>';
c+='# mousedrag the map to move it <br>';
c+='# doubleclick map to center player <br>';
c+='# click on neighboring locations to travel <br>';

c+='</div>';
$('.help','body').html(c);
}

///// Export Locs ////
function exportLocs(){
var c = '';
for (i in Locs){
c+= i + ': {<br>';

c+='name : "'+Locs[i].name+'",<br>';
c+='type : "'+Locs[i].type+'",<br>';
c+='x : '+Locs[i].x+',<br>';
c+='y : '+Locs[i].y+',<br>';
c+='con : ['+Locs[i].con+'],<br>';
c+='paths : ['+Locs[i].paths+']<br>';
c+='},<br>';
}
$('body').html('<div class="export">' + c + '</div>');
};

/////////// Location Editor //////////////
//drawLocsEdit()
function drawLocsEdit(){
var c = '<img src="src/style/img/map.jpg"><div id="map"></div><div id="btn" style="position:absolute;top:10px;left:10px;width:100px;height:25px;background:red;">Export</div>';
$('body').html(c);

var di = 0;

$('body').on('dblclick',function(){
$('#map').append('<div id="'+di+'" class="loc" style="position:absolute; top:100px; left:100px; width:12px; height:12px; margin-top:-6px; margin-left:-6px; z-index:3; background:#dec190; border-radius:16px; box-shadow:0 0 0 1px black,0 0 5px black;"></div>');
$('#' + di).draggable();
di++;
});

$('#btn','body').on('click',function(){
var c = '';
for (var i=0;i<di;i++){
var tx = $('#' + i,'#map').position().left;
var ty = $('#' + i,'#map').position().top;

c+='[' + tx + ','+ty+'],'
}
$('body').append('<div style="position:absolute;top:10px;left:10px;width:100%;height:100%;background:white;color:black">' + c + '</div>');
});
}
//////////////////////////////////////////	

