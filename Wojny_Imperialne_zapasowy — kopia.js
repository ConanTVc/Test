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


var caseNumber = 0;
var wait = 5;
var wait2 =5; //chodzenie
var x = 0;
var y = 0;
var czekaj=5;
var ilu_graczy;
var licznik=0;
var char_id;
var czekajpvp=135; //ile ma czekać jak spotka gracza na polu 
var czekajka=5;
var waiting=5;
var loc;
var telep = false;
var waiting1=1000;// czeka przy zmianie lokacji
var bylem1=false;
var whatNow=0;
var bylem2=false;
var bylem3=false;
var bylem4=false;
var antybot=false;
var done=false;
var przejscie=false;
var glebiadone=false;
var gotoglebia=false;
var isstop = false;
//-------czy ma schodzic na glebie i glebie rajskiej sali-----
var imperialki=true;
//----------------wybierz nacje---------
var jestembogiem=false;    // Imperium Bogów
var jestemkrolem=false;     // Imperium Saiyan
var jestemimperatorem=false;   //Imperium Armii Czerwonej Wstęgi
var jestemdemonem=true;      //Imperium Demonów Mrozu
//--------------wypowiadanie wojen------------------
var adimp=true;  //zaznacz true jeśli pełnisz funkcję imperatora lub admirała swojego imperium
var tabelka=[1,2,4]; //wpisz numery imperiów oprócz swojego 1 - RR, 2- Bogowie, 3 - Demony, 4 - Sayian
var i=0;
//------------------------------
var gotodemon=false;
var gotorr=false;
var gotogod=false;
var gotosaiyan=false;
var rr=false;
var saiyan=false;
var god=false;
var demon=false;
var shouldbey=0;
var zlaz=false;
var czekajki=5000;
var wojny=false;
var ilewojen;
var wojnabogowie=false;
var wojnademony=false;
var wojnasaiyan=false;
var wojnarr=false;
var licznik2=0;
var shouldbe=0;
var dogory=false;
var waitzagadka=300;
var obecnyx;
var obecnyy;
var tab;
var tab1;
var tab2;
var dlugosctablicy;
var tab3;
var koordx;
var koordy;
var tabb;
var tabb1;
var w=0;
var zmyl=0;

/* TEMPLATE */
var VERSION = '0.00';
var $css = `<style>
	.gh_btn {background: url(/gfx/layout/zalogowany-button-bg.png) no-repeat left top;
		height: 26px;
		line-height: 26px;
		display: inline-block;
		text-align: center;
		width: 103px;
		color: #01070d;
		text-decoration: none;
		font-size: 12px;
		font-weight: Bold;
		text-transform: uppercase;
		border: none;
		cursor: pointer;
	}</style>`
var $main = '<div id="gh_game_helper" style="position: fixed; top: 30px; left: 0; padding: 10px; background: rgba(70,128,193,0.9); z-index: 5;"></div>'
var $version = `<span style="position: absolute; bottom: 2px; right: 3px; color: rgb(6, 47, 88); line-height: 1; font-size: 13px; font-weight: 700;">${VERSION}</span>`
var $exp = '<button id="gh_exp_button" class="gh_btn" style="display: block; margin-bottom: 10px;">Exp: <span id="gh_exp_status" class="red">Off</span></button>'

$('body').append($main).append($css);
$('#gh_game_helper')
	.append($version)
	.append($exp);

/* ACTIONS */
$('#gh_exp_button').click(() => {
	if (isstop === true) {
		$('#gh_exp_status').text('On').attr('class', 'green');
		isstop = false
		start();
	} else {
		$('#gh_exp_status').text('Off').attr('class', 'red');
		isstop = true
	}
});

function start(){
if(isstop === false)
if(GAME.clan_wars.length < 10 && GAME.char_data.klan_id==12){
    GAME.emitOrder({a:39,type:24,shorts:"DIVINE;Legend;WEARE;DRAG;ODR;Heroes;MMM;CURSED;Mocarz;DESIRE;POWER;GODS;LOST;Angels;WT;CONTRA;Boobs;SPARTA;HG;GOS;DEATH"});
}
{
	kom_clear();
	$("button.more_players.poption").click()
	if(!GAME.is_loading){
	if(czy_sa_wojny()){
	if(!checkAntyBot()){
action();
	}
	else{window.setTimeout(idziewgore,6000);}
	}
	else {window.setTimeout(wypowiedz_wojny,wait);}
	}
	else {window.setTimeout(start,wait);}
}
	function action(){
switch (caseNumber) {
//case 0:
//caseNumber++;
//czy_sa_wojny();
//break;
case 0:
caseNumber++;
zkimwojny();
break;
case 1:
caseNumber++;
check_location();
break;
case 2:
caseNumber++;
check_players();
break;
case 3:
caseNumber++;
check_players2();
break;
case 4:
caseNumber++;
zmylka();
break;
case 5:
caseNumber++;
kill_players();
break;
case 6:
caseNumber++;
check_position_x();
break;
case 7:
caseNumber++;
check_position_y();	
break;
case 8:
caseNumber++;
zejdz();
break;
case 9:
caseNumber++;
check();
break;
case 10:
caseNumber++;
zmien_lokacje();
break;
case 11:
caseNumber++;
teleport();
break;
case 12:
caseNumber++;
go();
break;
case 13:
caseNumber++;
sprawdz_wojny();
break;
case 14:
caseNumber++;
upewnijsie();
break;
//case 12:
//caseNumber++;
//stop();
//break;
case 15:
caseNumber++;
sprawdz_y();
break;
case 16:
caseNumber++;
czyiscnaglebie();
break;
case 17:
caseNumber=0;
przejdz();
break;
default:
}}}

function go(){
	if(x==14 && y==14 && loc===1){
		rr=true;
		if(jestemkrolem){saiyan=true;}else{saiyan=false;}
		if(jestemdemonem){demon=true;}else{demon=false;}
		if(jestembogiem){god=true;}else{god=false;}
		telep=true;
		zlaz=true;
		done=false;
		window.setTimeout(start,wait);
	}
	else if(x==14 && y==14 && loc===2){
		god=true;
		if(jestemkrolem){saiyan=true;}else{saiyan=false;}
		if(jestemdemonem){demon=true;}else{demon=false;}
		if(jestemimperatorem){rr=true;}else{rr=false;}
		telep=true;
		zlaz=true;
		done=false;
		window.setTimeout(start,wait);
	}
	else if(x==14 && y==14 && loc===3){
		demon=true;
		if(jestembogiem){god=true;}else{god=false;}
		if(jestemimperatorem){rr=true;}else{rr=false;}
		if(jestemkrolem){saiyan=true;}else{saiyan=false;}
		telep=true;
		zlaz=true;
		done=false;
		window.setTimeout(start,wait);
	}
	else if(x==14 && y==14 && loc===4){
		saiyan=true;
		if(jestemdemonem){demon=true;}else{demon=false;}
		if(jestemimperatorem){rr=true;}else{rr=false;}
		if(jestembogiem){god=true;}else{god=false;}
		telep=true;
		zlaz=true;
		done=false;
		window.setTimeout(start,wait);
	}
	else if(x==15 && y==15 && loc==6){
		telep=true;
		done=true;
			bylem2=false;
			bylem3=false;
			bylem4=false;
		window.setTimeout(start,wait);
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
	else if(x==5 && y==5 && loc==6){
	dogory=true;
	saiyan=false;
	rr=false;
	god=false;
	demon=false;
	 go_right();}
	else if(x==13 && y==7 && loc==6){
		dogory=false;
		go_right();
	}
	else if (x==2 && y==11 && loc==5){
		przejscie=true;
		window.setTimeout(start,1000);
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
function check_position_x(){
x = $('#map_x').text();
window.setTimeout(start,wait);
}
function check_position_y(){
y = $('#map_y').text();
window.setTimeout(start,wait);
}
function check_players(){
	$("button.more_players.poption").click()
	if(0<document.getElementById("player_list_con").childElementCount){
		y = $('#map_y').text();
		zmyl++;
	if(document.getElementById("player_list_con").children[0].children[1].childElementCount==3 && y==2 && loc<6){
		tabb=document.getElementById("player_list_con").children[0].children[1].children[0].textContent.split(":");
		if(document.getElementById("player_list_con").children[0].children[1].children[0].textContent=="--:--:--" || parseInt(tabb[1])>3 && parseInt(tabb[2])>30 ){
			GAME.emitOrder({a:3,vo:GAME.map_options.vo},1);
			window.setTimeout(start,waiting1);}
			else{
			window.setTimeout(check_players,wait);}
		}else{
			window.setTimeout(start,wait);}
	}else {window.setTimeout(start,wait);}

}
function check_players2(){
	if(0<document.getElementById("player_list_con").childElementCount){
	if(document.getElementById("player_list_con").children[0].children[1].childElementCount==3){
	tabb=document.getElementById("player_list_con").children[0].children[1].children[0].textContent.split(":");
			if(parseInt(tabb[1])==0 && parseInt(tabb[2])<16){
				
				window.setTimeout(start,parseInt(tabb[2])*1100);
			}else {window.setTimeout(start,wait);}
	}else {window.setTimeout(start,wait);}
	}
	else {window.setTimeout(start,wait);}
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



function check_location(){
	if($('#map_name').text()==="Siedziba Imperium Saiyan")
	{ 	loc=4;
		//czekajpvp=300;
		bylem4=true;
		window.setTimeout(start,wait);}
         else if($('#map_name').text()==="Siedziba Imperium Demonów"){
			loc=3;
			//czekajpvp=300;
			 bylem3=true;
			window.setTimeout(start,wait);}
		else if ($('#map_name').text()==="Niebo"){
		loc=2;
		//czekajpvp=300;
		bylem2=true;
		window.setTimeout(start,wait);}
		else if($('#map_name').text()==="Siedziba Armii RR"){
		loc=1;
		//czekajpvp=300;
		bylem1=true;
		window.setTimeout(start,wait);}
		else if($('#map_name').text()==="Głębia"){
			loc=5;
			//czekajpvp=300;
			window.setTimeout(start,wait);}
			else if($('#map_name').text()==="Głębia Rajskiej Sali"){
				loc=6;
				//czekajpvp=100;
				window.setTimeout(start,wait);}
				else {
					loc=7;
					//czekajpvp=100;
				window.setTimeout(start,wait);}
}

function zmien_lokacje(){
if(jestembogiem){
	if(telep && saiyan){
		 if(wojnademony){
			gotodemon=true;
			window.setTimeout(start,wait);
		}
		else if(wojnarr){
			gotorr=true;
			window.setTimeout(start,wait);
		}
		
		else if (imperialki){
			gotoglebia=true;
			window.setTimeout(start,wait);
		}
		else {gotosaiyan=true;
		window.setTimeout(start,wait);}
	}
	else if (telep && demon){
		if(wojnarr){
			gotorr=true;
			window.setTimeout(start,wait);
		}
		else if (imperialki) {
			gotoglebia=true;
			window.setTimeout(start,wait);
		}
		else if(wojnasaiyan){
			gotosaiyan=true;
			window.setTimeout(start,wait);
		}
		else {gotorr=true;
		window.setTimeout(start,wait);
		}
	}
	else if (telep && rr){
		if(imperialki){
			gotoglebia=true;
			window.setTimeout(start,wait);
		}
		else if (wojnasaiyan){
			gotosaiyan=true;
			window.setTimeout(start,wait);
		}
		else if (wojnademony){
			gotodemon=true;
		window.setTimeout(start,wait);}
		else {gotorr=true;
		window.setTimeout(start,wait);
		}
	}
	else if(telep && done){
		if(wojnasaiyan){
			gotosaiyan=true;
			window.setTimeout(start,wait);
		}
		else if(wojnademony){
			gotodemon=true;
			window.setTimeout(start,wait);
		}
		else {gotorr=true;
		window.setTimeout(start,wait);
		}
	}

		else  {
	  window.setTimeout(start,wait);}
	
}


 else if(jestemimperatorem){
	if(telep && saiyan){
		if(wojnademony){
					gotodemon=true;
					window.setTimeout(start,wait);
		}
		else if(wojnabogowie){
			gotogod=true;
			window.setTimeout(start,wait);
		}
		else if (imperialki){
			gotoglebia=true;
			window.setTimeout(start,wait);
		}
		 else {gotosaiyan=true;
		window.setTimeout(start,wait);
		}
	}
	else if (telep && demon){
		if(wojnabogowie){
			gotogod=true;
			window.setTimeout(start,wait);
		}
		else if(imperialki){
			gotoglebia=true;
			window.setTimeout(start,wait);
		}
		else if(wojnasaiyan){
			gotosaiyan=true;
			window.setTimeout(start,wait);
		}
		else {gotodemon=true;
		window.setTimeout(start,wait);
		}
	}
	else if(telep && god){
		if (imperialki){
			gotoglebia=true;
			window.setTimeout(start,wait);
		}
		else if(wojnasaiyan){
			gotosaiyan=true;
			window.setTimeout(start,wait);
		}
		else if (wojnademony){
			gotodemon=true;
			window.setTimeout(start,wait);
		}
		else {gotogod=true;
		window.setTimeout(start,wait);
		}
	}
	else if(imperialki && done){
		if(wojnasaiyan){
			gotosaiyan=true;
			window.setTimeout(start,wait);
		}
		else if (wojnademony){
			gotodemon=true;
			window.setTimeout(start,wait);
		}
		else {gotogod=true;
		window.setTimeout(start,wait);
		}
	}
		
		
	
	
	
	
	else {window.setTimeout(start,wait);}
}
	
		else if(jestemdemonem){
				if(telep && saiyan){
					if(wojnabogowie){
						gotogod=true;
						window.setTimeout(start,wait);
					}
					else if (wojnarr){
						gotorr=true;
						window.setTimeout(start,wait);
					}
					else if(imperialki){
						gotoglebia=true;
						window.setTimeout(start,wait);
					}
					else {gotosaiyan=true;
					window.setTimeout(start,wait);
					}
				}
				else if(telep && god){
					if (wojnarr){
						gotorr=true;
						window.setTimeout(start,wait);
					}
					else if (imperialki){
						gotoglebia=true;
						window.setTimeout(start,wait);
					}
					else if (wojnasaiyan){
						gotosaiyan=true;
						window.setTimeout(start,wait);
					}
					else {gotogod=true;
					window.setTimeout(start,wait);
					}
				}
				else if (telep && rr){
					if (imperialki){
						gotoglebia=true;
						window.setTimeout(start,wait);
					}
					else if(wojnasaiyan){
						gotosaiyan=true;
						window.setTimeout(start,wait);
					}
					else if (wojnabogowie){
						gotogod=true;
						window.setTimeout(start,wait);
					}
					else {gotorr=true;
					window.setTimeout(start,wait);
					}
				}
				else if (telep && done){
					if (wojnasaiyan){
						gotosaiyan=true;
						window.setTimeout(start,wait);
					}
					else if (wojnabogowie){
						gotoglebia=true;
						window.setTimeout(start,wait);
					}
					else {gotorr=true;
					window.setTimeout(start,wait);
					}
				}
		
else {window.setTimeout(start,wait);}
}
 else if (jestemkrolem){
				if (telep && demon){
					if(wojnabogowie){
						gotogod=true;
					window.setTimeout(start,wait);}
						else if(wojnarr){
							gotorr=true;
							window.setTimeout(start,wait);
						} else if(imperialki){
							gotoglebia=true;
							window.setTimeout(start,wait);
						}
						else {gotodemon=true;
						window.setTimeout(start,wait);}
				} else if(telep && god){
					if(wojnarr){
						gotorr=true;
						window.setTimeout(start,wait);
					}
					else if(imperialki){
						gotoglebia=true;
						window.setTimeout(start,wait);
					}
					else if(wojnademony){
						gotodemon=true;
					window.setTimeout(start,wait);}
					else {gotogod=true;
					window.setTimeout(start,wait);}
				} else if(telep && rr){
					 if(imperialki){
						 gotoglebia=true;
						 window.setTimeout(start,wait);
					 }
					 else if(wojnademony){
						 gotodemon=true;
						 window.setTimeout(start,wait);
					 }
					 else if(wojnabogowie){
						 gotogod=true;
						 window.setTimeout(start,wait);
					 }
					 else {gotorr=true;
					 window.setTimeout(start,wait);
					 }
				} else if(telep && done){
					if(wojnademony){
						gotodemon=true;
						window.setTimeout(start,wait);
					}
				else if(wojnabogowie){
					gotogod=true;
					window.setTimeout(start,wait);
				}
				else {gotorr=true;
				window.setTimeout(start,wait);}
				}
						

 else {window.setTimeout(start,wait);}
			
} 
}



function teleport(){
if(telep && gotosaiyan){
	gotosaiyan=false;
	saiyan=false;
	rr=false;
	god=false;
	demon=false;
	done=false;
	x=2;
	y=2;
	loc=4;
	shouldbe=4;
	telep=false;
	GAME.emitOrder({a:50,type:5,e:4});
	window.setTimeout(kill_players,waiting1);
}
else if(telep && gotodemon){
    telep=false;
	gotosaiyan=false;
	saiyan=false;
	rr=false;
	god=false;
	demon=false;
	done=false;
	x=2;
	y=2;
	loc=3;
	shouldbe=3;
	gotodemon=false;
	GAME.emitOrder({a:50,type:5,e:3});
		window.setTimeout(kill_players,waiting1);
}
else if(telep && gotogod)
{
    telep=false;
	gotosaiyan=false;
	saiyan=false;
	rr=false;
	god=false;
	demon=false;
	done=false;
	x=2;
	y=2;
	loc=2;
	shouldbe=2;
	gotogod=false;
	GAME.emitOrder({a:50,type:5,e:2});
	window.setTimeout(kill_players,waiting1);
}
else if(telep && gotorr){
     telep=false;
	 gotosaiyan=false;
	saiyan=false;
	rr=false;
	god=false;
	demon=false;
	done=false;
	 x=2;
	 y=2;
	 loc=1;
	 shouldbe=1;
	gotorr=false;
	GAME.emitOrder({a:50,type:5,e:1});
	window.setTimeout(kill_players,waiting1);
}
else if (telep && gotoglebia){
	glebiadone=true;
	telep=false;
	gotoglebia=false;
	gotosaiyan=false;
	saiyan=false;
	rr=false;
	god=false;
	demon=false;
	done=false;
	x=2;
	 y=2;
	 loc=5;
	 shouldbe=5;
	 GAME.emitOrder({a:12,type:18,loc:84});
	 window.setTimeout(kill_players,waiting1);}

else{window.setTimeout(start,wait);}
}

function zejdz(){
	if(zlaz){
		zlaz=false;
		if(GAME.emp_enemies.length==1 && !imperialki){
			telep=false;
			if(loc==3){
				window.setTimeout(powrotmrozy);
			}
			else if(loc==4){
				window.setTimeout(powrotsaiyan);
			}
			else if(loc==2){
				window.setTimeout(powrotbogowie);
			}
			else if(loc==1){
				window.setTimeout(powrotrr);
			}
			
		}else {
	GAME.emitOrder({a:16});
	window.setTimeout(start,waiting1);
	}}
	else{window.setTimeout(start,wait);}
}
function powrotmrozy(){
	x = parseInt($('#map_x').text());
	y = parseInt($('#map_y').text());
	if(x==2 && y==2){
		window.setTimeout(start,800);
	} else{
		GAME.map_move(6);
		window.setTimeout(powrotmrozy,100);
	}
	
}

function powrotsaiyan(){
	x = parseInt($('#map_x').text());
	y = parseInt($('#map_y').text());
	if(x==2 && y==2){
		window.setTimeout(start,800);
	} else{
		GAME.map_move(6);
		window.setTimeout(powrotmrozy,100);
	}
	
}
function powrotbogowie(){
	x = parseInt($('#map_x').text());
	y = parseInt($('#map_y').text());
	if(y==2){
		window.setTimeout(powrotbogowie2,wait);
	} else{
		GAME.map_move(2); 
		window.setTimeout(powrotbogowie,100);
	}
	
}
function powrotbogowie2(){
	x = parseInt($('#map_x').text());
	y = parseInt($('#map_y').text());
	if(x==2){
		window.setTimeout(start,800);
	}
	else{
		GAME.map_move(8);
		window.setTimeout(powrotbogowie2,wait);
	}
}

function powrotrr(){
	x = parseInt($('#map_x').text());
	y = parseInt($('#map_y').text());
	if(y==2){
		window.setTimeout(powrotrr2,wait);
	} else{
		GAME.map_move(2); 
		window.setTimeout(powrotrr,100);
	}
	
}
function powrotrr2(){
	x = parseInt($('#map_x').text());
	y = parseInt($('#map_y').text());
	if(x==2){
		window.setTimeout(start,800);
	}
	else{
		GAME.map_move(8);
		window.setTimeout(powrotrr2,wait);
	}
}
function czy_sa_wojny(){
	if($('#emp_war_cnt').text()>0){
//if(document.getElementById("ewar_list").childElementCount>0){
	wojny=true;
	//licznik2=0;
	// wojnabogowie=false;
	//wojnademony=false;
	//wojnasaiyan=false;
	//wojnarr=false;
		
	return true;
}
else {wojny=false;
return false;
}
}


function zkimwojny(){
	
		if(licznik2<document.getElementById("ewar_list").childElementCount && wojny && jestembogiem){
			if(document.getElementById("ewar_list").children[licznik2].children[1].attributes[0].value=="/gfx/empire/3.png" || document.getElementById("ewar_list").children[licznik2].children[4].attributes[0].value  =="/gfx/empire/3.png"){
				wojnademony=true;
				//console.log("wojna z demonami");
				licznik2++;
				window.setTimeout(zkimwojny,wait);
			}
			else if(document.getElementById("ewar_list").children[licznik2].children[1].attributes[0].value=="/gfx/empire/1.png" || document.getElementById("ewar_list").children[licznik2].children[4].attributes[0].value  =="/gfx/empire/1.png"){
				 wojnarr=true;
				//console.log("wojna z rr");
				licznik2++;
				window.setTimeout(zkimwojny,wait);
			}
			else if(document.getElementById("ewar_list").children[licznik2].children[1].attributes[0].value=="/gfx/empire/4.png" || document.getElementById("ewar_list").children[licznik2].children[4].attributes[0].value  =="/gfx/empire/4.png"){
			
			wojnasaiyan=true;
				//console.log("wojna z saiyanami");
				licznik2++;
				window.setTimeout(zkimwojny,wait);
			}//else{window.setTimeout(start,wait);}
		}
		else if(licznik2<document.getElementById("ewar_list").childElementCount && wojny && jestemimperatorem){
			if(document.getElementById("ewar_list").children[licznik2].children[1].attributes[0].value=="/gfx/empire/3.png" || document.getElementById("ewar_list").children[licznik2].children[4].attributes[0].value  =="/gfx/empire/3.png"){
				wojnademony=true;
				//console.log("wojna z demonami");
				licznik2++;
				window.setTimeout(zkimwojny,wait);
			}
			else if(document.getElementById("ewar_list").children[licznik2].children[1].attributes[0].value=="/gfx/empire/2.png" || document.getElementById("ewar_list").children[licznik2].children[4].attributes[0].value  =="/gfx/empire/2.png"){
				 wojnabogowie=true;
				//console.log("wojna z rr");
				licznik2++;
				window.setTimeout(zkimwojny,wait);
			}
			else if(document.getElementById("ewar_list").children[licznik2].children[1].attributes[0].value=="/gfx/empire/4.png" || document.getElementById("ewar_list").children[licznik2].children[4].attributes[0].value  =="/gfx/empire/4.png"){
			
			wojnasaiyan=true;
				//console.log("wojna z saiyanami");
				licznik2++;
				window.setTimeout(zkimwojny,wait);
			}//else{window.setTimeout(start,wait);}
		}
		else	if(licznik2<document.getElementById("ewar_list").childElementCount && wojny && jestemdemonem){
			if(document.getElementById("ewar_list").children[licznik2].children[1].attributes[0].value=="/gfx/empire/1.png" || document.getElementById("ewar_list").children[licznik2].children[4].attributes[0].value  =="/gfx/empire/1.png"){
				wojnarr=true;
				//console.log("wojna z rr");
				licznik2++;
				window.setTimeout(zkimwojny,wait);
			}
			else if(document.getElementById("ewar_list").children[licznik2].children[1].attributes[0].value=="/gfx/empire/2.png" || document.getElementById("ewar_list").children[licznik2].children[4].attributes[0].value  =="/gfx/empire/2.png"){
				 wojnabogowie=true;
				//console.log("wojna z bogami");
				licznik2++;
				window.setTimeout(zkimwojny,wait);
			}
			else if(document.getElementById("ewar_list").children[licznik2].children[1].attributes[0].value=="/gfx/empire/4.png" || document.getElementById("ewar_list").children[licznik2].children[4].attributes[0].value  =="/gfx/empire/4.png"){
			
			wojnasaiyan=true;
				//console.log("wojna z saiyanami");
				licznik2++;
				window.setTimeout(zkimwojny,wait);
			}//else{window.setTimeout(start,wait);}
		}
			else if(licznik2<document.getElementById("ewar_list").childElementCount && wojny && jestemkrolem){
			if(document.getElementById("ewar_list").children[licznik2].children[1].attributes[0].value=="/gfx/empire/3.png" || document.getElementById("ewar_list").children[licznik2].children[4].attributes[0].value  =="/gfx/empire/3.png"){
				wojnademony=true;
				//console.log("wojna z demonami");
				licznik2++;
				window.setTimeout(zkimwojny,wait);
			}
			else if(document.getElementById("ewar_list").children[licznik2].children[1].attributes[0].value=="/gfx/empire/2.png" || document.getElementById("ewar_list").children[licznik2].children[4].attributes[0].value  =="/gfx/empire/2.png"){
				 wojnabogowie=true;
				//console.log("wojna z bogami");
				licznik2++;
				window.setTimeout(zkimwojny,wait);
			}
			else if(document.getElementById("ewar_list").children[licznik2].children[1].attributes[0].value=="/gfx/empire/1.png" || document.getElementById("ewar_list").children[licznik2].children[4].attributes[0].value  =="/gfx/empire/1.png"){
			
			wojnarr=true;
				//console.log("wojna z rr");
				licznik2++;
				window.setTimeout(zkimwojny,wait);
			}//else{window.setTimeout(start,wait);}
		}
		else{window.setTimeout(start,wait);}		
		
		
		
		
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
		GAME.map_move(1);  //do dołu
		window.setTimeout(idziewboki,waitzagadka);
	}
	else if (y>koordy){
		GAME.map_move(2);    // do góry
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
		GAME.map_move(1); // do dołu
		window.setTimeout(powrot,waitzagadka);
	}
	else if (y>obecnyy){
		GAME.map_move(2);  // do góry
		window.setTimeout(powrot,waitzagadka);
	}
	else if(y==obecnyy && x==obecnyx){
		window.setTimeout(start,waitzagadka);
	}
	else {window.setTimeout(powrot,waitzagadka);
	}
}


function sprawdze(){
	if(y==obecnyy && x==obecnyx){
		
	window.setTimeout(sprawdze,waitzagadka);
	}
	else {
		window.setTimeout(idziewgore,2000);

	}
}










	function stop(){
		if($('#emp_war_cnt').text()==0){
			GAME.emitOrder({a:16});
			window.setTimeout(stop,waiting1);
		}
		else {window.setTimeout(czy_sa_wojny,wait);}
	}
	
	function upewnijsie(){
		licznik2=0;
	wojnabogowie=false;
	wojnademony=false;
	wojnasaiyan=false;
	wojnarr=false;
		
		
		if(loc==7){
			if (shouldbe<5){
			GAME.emitOrder({a:50,type:5,e:shouldbe});
			window.setTimeout(start,waiting1);
			} else {
				GAME.emitOrder({a:12,type:18,loc:84});
			window.setTimeout(start,waiting1);}
			
		} else{window.setTimeout(start,wait);}
			
	}
	function sprawdz_y(){
		y = $('#map_y').text();
		x = $('#map_x').text();
		//if(loc==6){wait2=30;}else{wait2=45;}
		if(y==shouldbey || y==2 || y==11 && loc==1 || y==10 && loc==1 || y==9 && loc==1 || y==8 && loc==1 || y==7 && loc==1 ||x==7 && y ==7 && loc==6 || x==9 && x==7 && loc==6 || x==8 && y==8 && loc==6 || x==10 && y==8 && loc==6 || loc==6 || x!==2 || x!==14){
			window.setTimeout(start,wait);
		}
		else {
			GAME.map_move(2);
window.setTimeout(start,wait2);
}
	}
	function przejdz(){
		if(przejscie){
			przejscie=false;
			x=1;
			y=1;
			loc=6;
			czekajka;
			shouldbey=1;
			GAME.emitOrder({a:6,tpid:0});
			
			window.setTimeout(start,waiting1);
		}
		else {window.setTimeout(start,wait);
		}
	}
	function czyiscnaglebie(){
		if (imperialki && jestemimperatorem  && bylem2 || !wojnabogowie && bylem3 || !wojnademony && bylem4 || !wojnasaiyan){
			//glebiadone=false;
			// bylem1=false;
			// bylem2=false;
			// bylem3=false;
			//bylem4=false;
			window.setTimeout(start,wait);
		}  else if(imperialki && jestembogiem && bylem1 || !wojnarr && bylem3 || !wojnademony && bylem4 || !wojnasaiyan){
			//glebiadone=false;
			// bylem1=false;
			 //bylem2=false;
			// bylem3=false;
			//bylem4=false;
			window.setTimeout(start,wait);
		}
		else if(imperialki && jestemdemonem && bylem1 || !wojnarr && bylem2 || !wojnabogowie && bylem4 || !wojnasaiyan){
			//glebiadone=false;
			// bylem1=false;
			// bylem2=false;
			 //bylem3=false;
			//bylem4=false;
			window.setTimeout(start,wait);
			
		} else if (imperialki && jestemkrolem && bylem1 ||!wojnarr && bylem2 || !wojnabogowie && bylem3 || !wojnademony){
			//glebiadone=false;
			// bylem1=false;
			// bylem2=false;
			// bylem3=false;
			//bylem4=false;
			window.setTimeout(start,wait);
		}
		else  {window.setTimeout(start,wait);
		}
	}
	
function wypowiedz_wojny(){
if(adimp){
	var c=60500;
	if(i==2){
		c=2000;
	}
      if(i<3){
       		  GAME.emitOrder({a:50,type:7,target:tabelka[i]});
	          i++;
			  window.setTimeout(wypowiedz_wojny,c);
	  } else {i=0;
	  GAME.emitOrder({a:50,type:5,e:tabelka[0]});
	 window.setTimeout(start,2000);}
}else 
{
	 window.setTimeout(start,wait);
	  }
	
}
	function sprawdz_wojny(){
		if(adimp && wojny && parseInt($('#emp_war_cnt').text())<3){
			if(!wojnabogowie && !jestembogiem){
				GAME.emitOrder({a:50,type:7,target:2});
			}
			else if(!wojnarr && !jestemimperatorem){
				GAME.emitOrder({a:50,type:7,target:1});
			}
			else if (!wojnademony && !jestemdemonem){
				GAME.emitOrder({a:50,type:7,target:3});
			}
			else if(!wojnasaiyan && !jestemkrolem){
				GAME.emitOrder({a:50,type:7,target:4});
			}
			 window.setTimeout(start,wait);
		} else {
	window.setTimeout(start,wait);
		}
	}
	
	function check(){
		var z =parseInt($('#emp_war_cnt').text());
		
		var table=GAME.emp_enemies;
		if(w<z){
			if(document.getElementById("ewar_list").children[w].lastChild.textContent==="--:--:--"){
				if (table[w]==1){
					wojnarr=false;
					if(loc==1){
						rr=true;
						telep=true;
						GAME.emitOrder({a:16});
					}
					window.setTimeout(start,wait);
				} 
				else if (table[w]==2){
					wojnabogowie=false;
					if(loc==2){
						god=true;
						telep=true;
						GAME.emitOrder({a:16});
					}
					window.setTimeout(start,wait);
				} 
				else if(table[w]==3){
					wojnademony=false;
					if(loc==3){
						demon=true;
						telep=true;
						GAME.emitOrder({a:16});
					}
					
					window.setTimeout(start,wait);
				} 
				else if (table[w]==4){
					wojnasaiyan=false;
					if(loc==4){
						saiyan=true;
						telep=true;
						GAME.emitOrder({a:16});
					}
					
					window.setTimeout(start,wait);
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
	function zmylka(){
		var tabs=[2,4,7,8];
		var max=10;
	if(0<document.getElementById("player_list_con").childElementCount){	
		if(zmyl==tabs[Math.floor(Math.random()*tabs.length)] || zmyl>=max){
			zmyl=0;
			if(y%2==0 && loc<6 && parseInt(x)!==14 && parseInt(y)!==2){
				GAME.map_move(7);
				window.setTimeout(go_left2,250);
				}
				else if (y%2!==0 && parseInt(x)!==2 && loc<6){
				GAME.map_move(8);
				window.setTimeout(go_right2,250);
				}else {window.setTimeout(start,10);}
			
		} else {window.setTimeout(start,10);}
		
	}else {window.setTimeout(start,10);}
	}
	function go_left2(){
	GAME.map_move(8);
	window.setTimeout(kill_players,250);
}

function go_right2(){
GAME.map_move(7);
window.setTimeout(kill_players,250);
}
	
	
start();