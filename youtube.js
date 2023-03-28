function onLoad(){
    print("");
    print("");
    print("Script YoutubeApi by яɮ;!м4]и[u;Ҳ'");

}
//var video;
//var url="https://youtube.googleapis.com/youtube/v3/videos?part=id&part=snippet&id="+video+"&maxResults=3&key=AIzaSyCpRJcO2hK3EHIVzCY310jeJPBqUM7iig4";

function obtenerId(msg){
var id = msg.substr(msg.indexOf("v=")+2,11);
return obtenerResultados(id);
}

function obtenerResultados(id){
var http = new HttpRequest();
http.utf=true;
http.src= "https://youtube.googleapis.com/youtube/v3/videos?part=id&part=snippet&id="+id+"&maxResults=3&key=AIzaSyCpRJcO2hK3EHIVzCY310jeJPBqUM7iig4"
http.oncomplete = function(e){
  if(e){
   var result = JSON.parse(this.page);
   return mostrarResultados(result)
  }
}
http.download();
;
}
function obtenerBusquedad(name,cantidadmax){
  var http = new HttpRequest();
  http.utf=true;
  http.src="https://youtube.googleapis.com/youtube/v3/search?part=id&maxResults="+cantidadmax+"&q="+name+"&key=AIzaSyCpRJcO2hK3EHIVzCY310jeJPBqUM7iig4"
  http.oncomplete = function(e){
    if(e){
      var result = JSON.parse(this.page);
        return mostrarBusquedad(result);
    }
  }
  http.download();
}

function mostrarBusquedad(obj){
  var ids=[];
  if(obj.items.length>1){
    for(var i in obj.items){
      if(obj.items[i].id.hasOwnProperty("videoId")){
        ids.push(obj.items[i].id.videoId);
      }
    }
  }
  print("Cantidad de resultados:"+ids.length)
  var timer = new Timer();
  timer.interval=1000
  var i = 0;
  timer.oncomplete= function(){
   if(i<ids.length){
    print("Link: https://www.youtube.com/watch?v="+ids[i]);
    obtenerResultados(ids[i])
    i++;
     timer.start();
  } else {
    timer.stop();
  }
}
  if(ids.length>0){  
    timer.start();
}
  
}
function mostrarResultados(obj){
var titulo = obj.items[0].snippet.title;
var canal = obj.items[0].snippet.channelTitle;
var scribble = new Scribble();
scribble.src= obj.items[0].snippet.thumbnails.default.url;
scribble.oncomplete = function(e){
if(e){
  user(parseInt(this.arg)).scribble(this);
}
}
print("Canal: "+canal);
print("Titulo: "+titulo);
Users.local(function(u){
  scribble.download(u.id)
});

}

function onTextAfter(u, text)  { 
    if(text.indexOf("youtube.com/watch?v=")>=0){
      obtenerId(text);
    } else {
      
    }
}
function onCommand(u,cmd,target,args){
  if(cmd.substr(0,7)=="search "){
    var temporal = cmd.substr(7).split(",")
    var name = temporal[0];
    var maxresult = temporal[1];
    obtenerBusquedad(name,maxresult);
  }
}

function onHelp(u){
  print(u,"Para buscar un video de youtube /search +titulo,+resultadosmax  Ejemplo: /search acru,10");
}

