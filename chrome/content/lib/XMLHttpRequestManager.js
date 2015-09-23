var torpedo = torpedo || {};

torpedo.xmlhttprequestmanager = torpedo.xmlhttprequestmanager || {};

torpedo.xmlhttprequestmanager.redirectionCheck = function (url,element,event) 
{
	var req = new XMLHttpRequest();
	req.open("HEAD",url,true);
	req.channel.QueryInterface(Components.interfaces.nsIHttpChannel).redirectionLimit = 0;
	req.onreadystatechange = function (aEvt) 
	{
		var location = req.getResponseHeader("Location");
		var server = req.getResponseHeader("Server");
		var path = req.getResponseHeader("Path");
		
		if (req.readyState == 4) 
		{
			
			if(req.status == 200)
			{
				element.setAttribute("redirection","false");
				element.setAttribute("tooltiptext",""+torpedo.stringsBundle.getString('check_url_ok'));
				$(element).unbind('click', torpedo.handler.mouseClickHref);
				openUILink(""+url, event, false, true);
			}
			
			if(req.status == 0 || req.status == 301 || req.status == 302 || req.status == 303 || req.status == 307 || req.status == 308)
			{	
				var result;
				if(location != null)
				{
					result = torpedo.dialogmanager.createRedirection(600,120,torpedo.stringsBundle.getString('response_url_redirect_verifiable_server'),location,torpedo.stringsBundle.getString('response_url_redirect_question'));
					element.setAttribute("tooltiptext",""+torpedo.stringsBundle.getString('response_url_redirect_verifiable_server'));
					element.setAttribute("redirection_accept","false");
					element.setAttribute("redirection_url",""+location);
					
				}
				else
				{
					result = torpedo.dialogmanager.createRedirection(600,120,torpedo.stringsBundle.getString('response_url_redirect_no_verifiable_server'),"","");
					element.setAttribute("tooltiptext",""+torpedo.stringsBundle.getString('response_url_redirect_no_verifiable_server'));
					element.setAttribute("redirection_accept","false");
				}
				
				element.setAttribute("redirection","true");
				$(element).unbind('click', torpedo.handler.mouseClickHref);
				
				if(result)
				{
					element.setAttribute("redirection_accept","true");
					openUILink(""+url, event, false, true);
				}
				else
				{
					element.setAttribute("redirection_accept","false");
					$(element).bind('click', torpedo.handler.mouseClickHrefRedirection);
				}
			}					
		}
		torpedo.updateTooltip(url,element);
	};
	req.send(null);
}
