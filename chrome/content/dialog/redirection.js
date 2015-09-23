// Called once if and only if the user clicks OK
function pressedOK() 
{
   window.arguments[0].out.accept = true;
   return true;
}

function onLoad() {
  // Use the arguments passed to us by the caller
  var url = window.arguments[0].inn.url;
  var baseDomain = window.arguments[0].inn.domain;
  var urlsplit = url.split(""+baseDomain);
  
  document.getElementById("description").innerHTML = window.arguments[0].inn.description;
  document.getElementById("url1").innerHTML = urlsplit[0];
  document.getElementById("baseDomain").innerHTML = baseDomain;
  
  if(urlsplit.length >2)
  {
	document.getElementById("url2").innerHTML = urlsplit[2];
  }
  
  document.getElementById("question").innerHTML = window.arguments[0].inn.question;
}