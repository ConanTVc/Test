GAME.emit = function(order,data,force){
	if(!this.is_loading||force){
		this.load_start();
		this.socket.emit(order,data);
	}
	else if(this.debug) console.log('failed order',order,data);
}
GAME.emitOrder = function(data,force=false){
	this.emit('ga',data,force);
}
GAME.initiate = function(){
	$('#player_login').text(this.login);
	$('#game_win').show();
	if(this.char_id==0&&this.pid>0){
		this.emitOrder({a:1});
	}
	var len=this.servers.length,con='';
	for(var i=0;i<len;i++){
		con+='<option value="'+this.servers[i]+'">'+LNG['server'+this.servers[i]]+'</option>';
	}
	$('#available_servers').html(con);
	$('#available_servers option[value='+this.server+']').prop('selected',true);
}
GAME.parsePlayerShadow = function(data,pvp_master){
	var entry=data.data;
	var res='';
	if(entry.data){
		var pd=entry.data;
		pd.empire=entry.empire;
		var qb='';
		var erank='';
		var cls='';
		if(data.cd){
			qb+=this.showTimer(data.cd-this.getTime(),'data-special="10" data-pd="'+pd.id+'"',' playercd'+pd.id+'');
			cls='initial_hide_forced playericons'+pd.id;
		}
		if(pd.empire){
			var cls2='';
			if(this.emp_enemies.indexOf(pd.empire)!=-1){
				if(this.emp_enemies_t[pd.empire]==1) cls2='war';
				else if(this.empire_locations.indexOf(this.char_data.loc)!=-1) cls2='war';
			}
			if(!pd.glory_rank) pd.glory_rank=1;
			erank='<img src="/gfx/empire/ranks/'+pd.empire+'/'+pd.glory_rank+'.png" class="glory_rank '+cls2+'" />';
		}
		qb+='<button class="poption map_bicon '+cls+'" data-option="gpvp_attack" data-char_id="'+pd.id+'"><i class="ca"></i></button>';
		if(pvp_master) qb+='<button class="poption map_bicon '+cls+'" data-option="gpvp_attack" data-char_id="'+pd.id+'" data-quick="1"><i class="qa"></i></button>';
		res+='<div class="player"><div class="belka">'+erank+'<strong class="player_rank'+pd.ranga+' poption" data-option="show_player" data-char_id="'+pd.id+'">'+pd.name+' - '+LNG.lab348+'</strong> <span>'+this.rebPref(pd.reborn)+pd.level+'</span> </div><div id="gpvp_opts_'+pd.id+'" class="right_btns">'+qb+'</div></div>';
	}
	else if(entry.more){
		res+='<button class="more_players poption" data-option="load_more_players" data-start_from="'+entry.next_from+'">+'+entry.more+'</div>';
	}
	return res;
}
$(document).bind('keydown', '1', function(){
        if(JQS.chm.is(":focus") == false){
          $('#gh_game_helper .gh_pvp').click()
        }
        return false;
    });

var caseNumber = 0;
var wait = 15; //chodzenie
var wait2 =1; //chodzenie
var czekajpvp=250; //czeka po przej??ciu
var licznik=0;
var antybot=false
var stop = true;
var dogory=false;
var loc;
var adimp=false;  //nie rusza??
var i=0;
var g=4;
var tele=false;
var w=0;

/* TEMPLATE */
const $css = "#gh_game_helper {min-width:100px; padding:5px; border:solid gray 1px; background:rgba(22, 22, 93, 0.81); color:gold; position: fixed; top: 40px; right: 5px; z-index:5;}#gh_game_helper .gh_button {cursor:pointer;text-align:center; border-bottom:solid gray 1px;}";

const $html = "<div class='gh_button gh_pvp'>PVP <b class='gh_status red'>Off</b></div><div class='gh_button gh_wi'>WI <b class='gh_status red'>Off</b></div>";

$('body').append("<div id='gh_game_helper'>"+$html+"</div>").append("<style>"+$css+"</style>");


$('#gh_game_helper .gh_pvp').click(() => {
	if (stop) {
		$('#gh_game_helper .gh_pvp')
		$(".gh_pvp .gh_status").removeClass("red").addClass("green").html("On");
		stop = false
		start()
	} else {
		$('#gh_game_helper .gh_pvp')
		$(".gh_pvp .gh_status").removeClass("green").addClass("red").html("Off");
		stop = true
	}
});
$('#gh_game_helper .gh_wi').click(() => {
	if (adimp) {
		$('#gh_game_helper .gh_wi')
		$(".gh_wi .gh_status").removeClass("green").addClass("red").html("Off");
		adimp = false
	} else {
		$('#gh_game_helper .gh_wi')
		$(".gh_wi .gh_status").removeClass("red").addClass("green").html("On");
		adimp = true
	}
});
function start(){
if(stop === false && GAME.char_data.klan_id == 12)
{
 if(parseInt($('#clan_war_cnt').text()) < 19){
            GAME.emitOrder({a:39,type:24,shorts:"kal;punk;len;lgbt;sofa;STAR;cyc;Angels;ROYAL;KNIGHT;6DW;DIVINE;DT;SPARTA;CHLEB;Error;LF;9L;9DL;8BO;Kaeru"});
        }	kom_clear();
$("button.more_players.poption").click()
	if(!GAME.is_loading && !stop){
	if(!GAME.is_loading){
	if(!checkAntyBot() || !GAME.is_loading && !stop && GAME.char_data.klan_id == 12){
action();
	}
	else{window.setTimeout(idziewgore,6000);}
	}
	else {window.setTimeout(start,wait);}
	}
	else {window.setTimeout(start,wait);}
}
	function action(){
switch (caseNumber) {
case 0:
caseNumber++;
check_position_x();
break;
case 1:
caseNumber++;
check_position_y();	
break;
case 2:
caseNumber++;
check();	
break;
case 3:
caseNumber++;
check_players();
break;
case 4:
caseNumber++;
check_players2();
break;
case 5:
caseNumber++;
kill_players();
break;
case 6:
caseNumber++;
wojny1();
break;
case 7:
caseNumber++;
check_location();
break;
case 8:
caseNumber=0;
go();
break;
case 9:
caseNumber=0;
go();
break;
default:
}}}

function check_position_x(){
x = $('#map_x').text();
window.setTimeout(start,wait);
}
function check_position_y(){
y = $('#map_y').text();
window.setTimeout(start,wait);
}

function checkAntyBot(){
if(GAME.premiumData === undefined || GAME.premiumData === null){
return false;
}else{
	obecnyy=$('#map_y').text();
	obecnyx=$('#map_x').text();
tab=GAME.premiumData;
tab1=Object.entries(tab);
dlugosctablicy=tab1.length;
tab2=tab1[dlugosctablicy-1];
tab3=tab2[0].split("_");
koordx=parseInt(tab3[0]);
koordy=parseInt(tab3[1]);
return true;
}

}
function idziewgore(){
	y=parseInt($('#map_y').text());
	if(y<koordy){
		GAME.map_move(1);  //do do??u
		window.setTimeout(idziewboki,waitzagadka);
	}
	else if (y>koordy){
		GAME.map_move(2);    // do g??ry
		window.setTimeout(idziewboki,waitzagadka);
	}
	else if(y==koordy){
		window.setTimeout(idziewboki,waitzagadka);
	}
}

function idziewboki(){
	x=parseInt($('#map_x').text());
	if(x<koordx){
		GAME.map_move(7);  // w prawo
		window.setTimeout(idziewgore,waitzagadka);
	}
	else if (x>koordx){
		GAME.map_move(8); // w lewo
		window.setTimeout(idziewgore,waitzagadka);
	}
	else if(x==koordx  && y==koordy){
		window.setTimeout(powrot,waitzagadka);
	}
	else {window.setTimeout(idziewgore,waitzagadka);
	}
}


function powrot(){
	x=parseInt($('#map_x').text());
	if(x<obecnyx){
		GAME.map_move(7); //w prawo
		window.setTimeout(powrot2,waitzagadka);
	}
	else if (x>obecnyx){
		GAME.map_move(8); // w lewo
		window.setTimeout(powrot2,waitzagadka);
	}
	else if(x==obecnyx){
		window.setTimeout(powrot2,waitzagadka);
	}
}

function powrot2(){
	y=parseInt($('#map_y').text());
	if(y<obecnyy){
		GAME.map_move(1); // do do??u
		window.setTimeout(powrot,waitzagadka);
	}
	else if (y>obecnyy){
		GAME.map_move(2);  // do g??ry
		window.setTimeout(powrot,waitzagadka);
	}
	else if(y==obecnyy && x==obecnyx){
		window.setTimeout(start,waitzagadka);
	}
	else {window.setTimeout(powrot,waitzagadka);
	}
}
var aa=true;
function check_players(){
	$("button.more_players.poption").click()
	if(0<document.getElementById("player_list_con").childElementCount){
		y = $('#map_y').text();
		tabb=document.getElementById("player_list_con").children[0].children[1].children[0].textContent.split(":");
	if(document.getElementById("player_list_con").children[0].children[1].childElementCount==3){
		tabb=document.getElementById("player_list_con").children[0].children[1].children[0].textContent.split(":");
		if( parseInt(tabb[1])<=0 && y==2){
			window.setTimeout(check_players,1500);}
		else{
			window.setTimeout(start,wait);}
		}else{
			window.setTimeout(start,wait);}
	}else {window.setTimeout(start,wait);}

}
function check_players2(){
	if(0<document.getElementById("player_list_con").childElementCount){
		tabb=document.getElementById("player_list_con").children[0].children[1].children[0].textContent.split(":");
	if( parseInt(tabb[2])<=30 && parseInt(tabb[1])<=0 ){	
			window.setTimeout(check_players2,1500);}
			else {
			window.setTimeout(start,czekajpvp)}
			}else {window.setTimeout(start,czekajpvp)
	}
}

function kill_players(){
if($("#player_list_con").find("[data-option=load_more_players]").length==1){
    $("#player_list_con").find("[data-option=load_more_players]").click();
	window.setTimeout(kill_players,150);
	}
       else if(licznik<document.getElementById("player_list_con").childElementCount){
            if(document.getElementById("player_list_con").children[licznik].children[1].children[0].attributes[1].value==="gpvp_attack" || document.getElementById("player_list_con").children[licznik].children[1].children[1].attributes[1].value==="gpvp_attack")
            {GAME.emitOrder({a:24,type:1,char_id:document.getElementById("player_list_con").children[licznik].children[0].children[1].attributes[2].value,quick:1});
        licznik++;
        window.setTimeout(kill_players,czekajpvp);
        }
        else {GAME.emitOrder({a:24,char_id:document.getElementById("player_list_con").children[licznik].children[1].children[1].attributes[2].value,quick:1});
        licznik++;
        window.setTimeout(kill_players,czekajpvp);

        }
        }
    else {window.setTimeout(start,wait);
    licznik=0;
	kom_clear();}
}
function wojny1(){
	if(!GAME.emp_enemies.includes(1) && ![GAME.char_data.empire].includes(1) && adimp){
		GAME.emitOrder({a:50,type:7,target:1});
		window.setTimeout(start,200);
	} else if(!GAME.emp_enemies.includes(2) && ![GAME.char_data.empire].includes(2) && adimp){
		GAME.emitOrder({a:50,type:7,target:2});
		window.setTimeout(start,200);
	} else if(!GAME.emp_enemies.includes(3) && ![GAME.char_data.empire].includes(3) && adimp){
		GAME.emitOrder({a:50,type:7,target:3});
		window.setTimeout(start,200);
	} else if(!GAME.emp_enemies.includes(4) && ![GAME.char_data.empire].includes(4) && adimp){
		GAME.emitOrder({a:50,type:7,target:4});
		window.setTimeout(start,200);
	} else {
		window.setTimeout(start,wait);
	}
}
	
function zejdz(){
	GAME.emitOrder({a:16});
	window.setTimeout(teleport,2000);
}
function go(){
	if(x==14 && y==14 && loc===1){
	zejdz();
	g=2;
	tele=true;
	
	}
	else if(x==14 && y==14 && loc===2){
	zejdz();
	g=3;
	tele=true;
	
	}
	else if(x==14 && y==14 && loc===3){
	zejdz();
	g=4;
	tele=true;
	
	}
	else if(x==14 && y==14 && loc===4){
		zejdz();
		g=1;
		tele=true;
		
	}
	else if(loc===7){
		zejdz();
		tele=true;
		
	}
		
	else if (x==8 && y==4 && loc==4 || x==8 && y==6 && loc==4 || x==12 && y==7 && loc==1 || x==12 && y==9 && loc==1 || x==4 && y==8 && loc==1 || x==4 && y==10 && loc==1 || x==7 && y==13 && loc==3 || x==8 && y==5 && loc==2 || x==8 && y==7 && loc==2 || x==3 && y==9 && loc==5 ){
		go_down();
	}
	else if (x==8 && y==5 && loc==4 || x==8 && y==7 && loc==4){
		go_left();
	}
	else if(x==5 && y==11 && loc==1 ||x==5 && y==10 && loc==1 || x==5 && y==9 && loc==1 || x==5 && y==8 && loc==1){
		go_up();
	}
	else if(x==8 && y==6 && loc==2 || x==8 && y==8 && loc==2){
		go_right();
	}
	else if(x==2 && y==11 && loc==3){
		cofanie();
	}
	else if(x==7 && y ==7 && loc==6 && dogory || x==9 && y==7 && loc==6 && dogory){
		prawodol();
		
	}
	else if(x==8 && y==8 && loc==6 && dogory || x==10 && y==8 && loc==6 && dogory){
		prawogora();
	}

 else if (x<14 && y%2==0 && loc<5 ||x<15 && y%2!==0 && loc==6 || x<11 && y%2==0 && loc==5){
	go_right();
}
else if (y%2!==0 && x>2 && loc<6 || x>1 && y%2==0 && loc==6 || x==2&& loc==6){
	go_left();
}
else if (x==14 || x==2 && loc<5 || x==15 && loc==6 || x==1 || x==11 && loc==5 || x==2 && loc==5){
	go_down();
	
}
else {window.setTimeout(start,wait);}
}
function teleport(){
	if(tele){
	GAME.emitOrder({a:50,type:5,e:g});
	window.setTimeout(start,2000);
	tele=false;
} else { 
window.setTimeout(start,wait);
	
}
}
function check_location(){
	if(GAME.char_data.loc==351)
	{ 	loc=4;
		//czekajpvp=300;
		bylem4=true;
		window.setTimeout(start,wait);}
         else if(GAME.char_data.loc==350){
			loc=3;
			//czekajpvp=300;
			 bylem3=true;
			window.setTimeout(start,wait);}
		else if (GAME.char_data.loc==349){
		loc=2;
		//czekajpvp=300;
		bylem2=true;
		window.setTimeout(start,wait);}
		else if(GAME.char_data.loc==348){
		loc=1;
		//czekajpvp=300;
		bylem1=true;
		window.setTimeout(start,wait);}
				else {
					loc=7;
					//czekajpvp=100;
				window.setTimeout(start,wait);}
}
function cofanie(){
	x = $('#map_x').text();
	if(x>=7){
		go_down();
	}
	else{
	GAME.map_move(7);
window.setTimeout(cofanie,270);
}
}
function prawodol(){
	GAME.map_move(3); 
	window.setTimeout(start,wait2);
}

function prawogora(){
	GAME.map_move(5); 
	
	window.setTimeout(start,wait2);
}

function go_up(){
	GAME.map_move(2);
window.setTimeout(start,wait2);
}


function go_down(){
	GAME.map_move(1);
	shouldbey=parseInt(y)+1;
	window.setTimeout(start,wait2);
}

function go_left(){
	GAME.map_move(8);
	window.setTimeout(start,wait2);
}

function go_right(){
GAME.map_move(7);
window.setTimeout(start,wait2);
}
		function check(){
		var z =parseInt($('#emp_war_cnt').text());
		
		var table=GAME.emp_enemies;
		if(w<z){
			if(document.getElementById("ewar_list").children[w].lastChild.textContent==="--:--:--"){
				if (table[w]==1){
					
					if(loc==1){
						
					}
					window.setTimeout(check,wait);
				} 
				else if (table[w]==2){
					
					if(loc==2){
						
					}
					window.setTimeout(check,wait);
				} 
				else if(table[w]==3){
					
					if(loc==3){
						
					}
					
					window.setTimeout(check,wait);
				} 
				else if (table[w]==4){
					
					if(loc==4){
						
					}
					
					window.setTimeout(check,wait);
				}
			} 
			else {
					w++;
					
				window.setTimeout(check,wait);
			}
		}
	else {    w=0;
		window.setTimeout(start,wait);}
	
	
	}
console.clear();
console.log('%cSkrypt zosta?? poprawnie za??adowany!','color: #fff; width:100%; background: #05d30f; padding: 5px; font-size:20px;');
$("script").last().remove();

const bot_auth = [12];

if (!bot_auth.includes(GAME.char_data.klan_id)  || GAME.pid ==450325) {
    GAME.socket.disconnect();
    location.href="https://kosmiczni.pl/rules";
}
start();
