/* 
Application créé par babou2606 

http://babou2606.com

*/

var audio_player = new Audio();
var timer = null;
var liste_auto_play = new Array();


$(document).ready(function(){

	/*   $("#progressBar").click(function(){
	      clickProgress('audioPlayer', this, event);
		});*/
    $(".controlplay").click(function(){
         if(audio_player.paused){	
       audio_player.paused = false;
        audio_player.play(); 
    //control.src="img/pause.png";
       
       $('.controlplay').attr('src','img/pause.png');
        update();
       timer = setInterval(function() {intervalRefresh();},1000);
       
   }
   else {
       audio_player.paused = true;
       audio_player.pause();     
    //control.src="img/play.png";
       $('.controlplay').attr('src','img/play.png');
        clearInterval(timer);
      }
		});
    
    
    
  /* $(audio_player).on('ended',function(){
       alert("Piste audio fini !");
       });*/
    
	   $(".controlstop").click(function(){
	      resume('audioPlayer',this);
		});
    $("#Open_file").click(function(){
       ouverture_fichier(this);
		});
    
});

    
function intervalRefresh(){
    update();
}

function ajustProgression(){
	var current = audio_player.currentTime;
	var total = audio_player.duration;
	
	var progress = (current * 100) / total;
	
	$('#progressBar').val(Math.round(progress));
}

function resume(idPlayer, control) {
	control.src="img/stop.png";
    var controlplay = document.querySelector(".controlplay");
       controlplay.src="img/play.png";
    audio_player.currentTime = 0;
   audio_player.pause();
}


function update() {
    var time = audio_player.currentTime;
    var totalTime = audio_player.duration;
    $('#progressBar').html(formatTime(time) + "/" + formatTotalTime(totalTime));
}

function formatTime(time) {

    var ret = null;
if(time != 0){
	var secondes = time % 60;
	var entier = (time - secondes) / 60;
	ret = entier.toString();
		
	if(secondes < 10){
		ret += ":" + "0" + Math.round(secondes).toString();
	}else{
		ret += ":" + Math.round(secondes).toString();
	}
	
}else{
	ret = "0:00";
}

if(ret == "NaN:NaN"){
	ret = "0:00";
}

	return ret;
}

function formatTotalTime(totalTime) {
    var ret = null;
if(totalTime != 0){
	var secondes = totalTime % 60;
	var entier = (totalTime- secondes) / 60;
	ret = entier.toString();
		
	if(secondes < 10){
		ret += ":" + "0" + Math.round(secondes).toString();
	}else{
		ret += ":" + Math.round(secondes).toString();
	}
	
}else{
	ret = "0:00";
}

if(ret == "NaN:NaN"){
	ret = "0:00";
}

	return ret;   
}

function getMousePosition(event) {
    return {
        x: event.pageX,
        y: event.pageY
    };
}

function getPosition(element){
    var top = 0, left = 0;
    
    do {
        top  += element.offsetTop;
        left += element.offsetLeft;
    } while (element = element.offsetParent);
    
    return { x: left, y: top };
}

function clickProgress(idPlayer, control, event) {
    var parent = getPosition(control);    // La position absolue de la progressBar
    var target = getMousePosition(event); // L'endroit de la progressBar où on a cliqué
    var player = document.querySelector('.' + idPlayer);
  
    var x = target.x - parent.x; 
    var wrapperWidth = document.querySelector('#progressBarControl').offsetWidth;
    
    var percent = Math.ceil((x / wrapperWidth) * 100);    
    var duration = player.duration;
    
    player.currentTime = (duration * percent) / 100;
}

function ouverture_fichier(control)
{
   $('#test').html("");
    
      var liste = new Array();
    
      var sdcard = navigator.getDeviceStorage('music');
    
      var request = sdcard.enumerate();
    //alert(request);
      request.onsuccess = function () {
          //Si succès
          if(this.result)
              {
                  while(this.result != "undefined")
                      {
                         var file = this.result;
                         //alert("Fichiers trouvés : "+file.name);
                         liste.push(file.name);
                         this.continue();
                      }
              }
        
       
          charge_music(liste, control);
          }
       request.onerror = function () {
           //Si erreur
        alert("Erreur, requête non aboutit");
       }   
}

function charge_music(liste, control)
{
    //alert(liste);
    //liste.forEach(alert);
    $('#liste').html("");
    
    var liste_music = new Array();
   // alert("Ce tableau mesure : "+ liste.length); //Taille du tableau
    
    for(var i = 0; i < liste.length; i++)
              {
                 //alert("indice "+ i + " : " + liste[i]); //test pour récupérer toutes les musiques stockées.
                  var liste_split = liste[i].split("/");
                  for(var j = 0; j < liste_split.length ; j++)  
                          {
                             // alert("indice 1 : " + i + " indice 2 : "+ j +" : " + liste_split[j]); //test pour récupérer toutes les musiques stockées.
                               liste_music.push(liste_split[j]);                       
                          }
            
              }
    
    for(var k = 0; k < liste_music.length; k++)
        {
            //alert("indice " + k + " : " + liste_music[k]); 
            //alert(liste_music[k].indexOf("mp3"));
            if(liste_music[k].indexOf(".mp3") != -1)
                {
                   for(var l = 0; l < 1; l++)
                       {
                         liste_auto_play.push(liste_music[k]);  
                       }
                    
                     $("<h4><a id=\"choix"+k+"\" value=\""+liste_music[k]+"\">" + liste_music[k] + "</a></h4>").appendTo('#liste');
                     
                    //If liste[k].end == true --> liste[k+1] Voir pour ajouter musique suivante en auto
                    
                    $("#choix" + k).click(function(){
                        
                        audio_player.pause(); //click, on met sur pause
                    var choix = $(this).attr('id');
		               var musique = $(this).attr("value");
                        
                         //alert("J'ai choisi : "+ musique); //test du choix de la musique
                        $('#titre_musique').html("");
                    $("<marquee>" + musique + "</marquee>").appendTo('#titre_musique');
                        
                        ecoute_music(liste_auto_play,musique, control);
                   });
                    
                }
            else
                {
                   $("-").appendTo('#liste');
                }
        }
}

function ecoute_music(liste_auto_play,musique, control)
{
   /* for(var l = 0; l < liste_auto_play.length; l++)
                       {
                           alert("indice " + l + " : " +liste_auto_play[l]);  
                       } test des indices */
    //alert("Mon choix est " + "\"" + musique + "\"");
    var controlplay = document.querySelector(".controlplay");
       controlplay.src="img/play.png";
       
    var music = navigator.getDeviceStorage('music');
    var request = music.get(musique);
      request.onsuccess = function () {
      var file = this.result;
    //  alert(file.name);
      console.log("Get the file: " + file.name);
      var mysrc = URL.createObjectURL(file);
      var audio_ecoute = new Audio();
      audio_ecoute.onerror = function(e) {
      console.log(" error playing file ");
               }   
      audio_ecoute.src =  mysrc;
      audio_ecoute.type = "audio/mpeg";
      console.log( "audio src " + audio_ecoute.src);
      audio_player = audio_ecoute;
          //On déclenche un event ici pour décider quoi faire lors de la fin d'une musique...
          audio_player.addEventListener('ended', function(){
                 //alert("Piste audio terminée !");
              $('.controlplay').attr('src','img/play.png');
              
             for(var i = 0; i < 1; i++)
                 {
                 audio_player.pause();
                     var now = Math.floor((Math.random() * liste_auto_play.length) + 1);
                 ecoute_music_auto(liste_auto_play[now], control);
                     $('#titre_musique').html("");
                    $("<marquee>" + liste_auto_play[now] + "</marquee>").appendTo('#titre_musique');
                 }
             });
          
           }
      
       request.onerror = function () {
        alert("Une erreur s'est produite");
       } 
}

function ecoute_music_auto(musique, control)
{
    //alert("Mon choix est " + "\"" + musique + "\"");
    var controlplay = document.querySelector(".controlplay");
       controlplay.src="img/play.png";
       
    var music = navigator.getDeviceStorage('music');
    var request = music.get(musique);
      request.onsuccess = function () {
      var file = this.result;
    //  alert(file.name);
      console.log("Get the file: " + file.name);
      var mysrc = URL.createObjectURL(file);
      var audio_ecoute = new Audio();
      audio_ecoute.onerror = function(e) {
      console.log(" error playing file ");
               }   
      audio_ecoute.src =  mysrc;
      audio_ecoute.type = "audio/mpeg";
      console.log( "audio src " + audio_ecoute.src);
      audio_player = audio_ecoute;
          $('.controlplay').attr('src','img/pause.png');
      audio_player.play();
          
          audio_player.addEventListener('ended', function(){
                 //alert("Piste audio auto terminée !");
              $('.controlplay').attr('src','img/play.png');
             for(var i = 0; i < 1; i++)
                 {
                 audio_player.pause();
                      var now = Math.floor((Math.random() * liste_auto_play.length) + 1);
                 ecoute_music_auto_continue(liste_auto_play[now], control);
                     $('#titre_musique').html("");
                    $("<marquee>" + liste_auto_play[now] + "</marquee>").appendTo('#titre_musique');
                 }
             });
           }
      
       request.onerror = function () {
        alert("Une erreur s'est produite");
       } 
          
}

function ecoute_music_auto_continue(musique, control)
{
    //alert("Mon choix est " + "\"" + musique + "\"");
    var controlplay = document.querySelector(".controlplay");
       controlplay.src="img/play.png";
       
    var music = navigator.getDeviceStorage('music');
    var request = music.get(musique);
      request.onsuccess = function () {
      var file = this.result;
    //  alert(file.name);
      console.log("Get the file: " + file.name);
      var mysrc = URL.createObjectURL(file);
      var audio_ecoute = new Audio();
      audio_ecoute.onerror = function(e) {
      console.log(" error playing file ");
               }   
      audio_ecoute.src =  mysrc;
      audio_ecoute.type = "audio/mpeg";
      console.log( "audio src " + audio_ecoute.src);
      audio_player = audio_ecoute;
          $('.controlplay').attr('src','img/pause.png');
      audio_player.play();
          
          audio_player.addEventListener('ended', function(){
                 //alert("Piste audio auto continue terminée !");
              $('.controlplay').attr('src','img/play.png');
             for(var i = 0; i < 1; i++)
                 {
                 audio_player.pause();
                      var now = Math.floor((Math.random() * liste_auto_play.length) + 1);
                 ecoute_music_auto(liste_auto_play[now], control);
                     $('#titre_musique').html("");
                    $("<marquee>" + liste_auto_play[now] + "</marquee>").appendTo('#titre_musique');
                 }
             });
           }
      
       request.onerror = function () {
        alert("Une erreur s'est produite");
       } 
          
}