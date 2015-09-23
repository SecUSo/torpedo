var torpedo = torpedo || {};

torpedo.responsecollator = torpedo.responsecollator || {};

torpedo.responsecollator.redirection = function (serverInfomration,stringsBundle) 
{
	if(serverInfomration.status == 200)
	{
		element.setAttribute("title",""+stringsBundle.getString('check_url_ok')+"\n\n"+mdyurl);
		return true;
	}
	
	if(serverInfomration.status == 0 || serverInfomration.status == 301 || serverInfomration.status == 302)
	{
		var result;
		if(serverInfomration.location != null)
		{
			result = torpedo.dialogmanager.createQuestion(600,90,stringsBundle.getString('response_url_redirect_verifiable_server'),serverInfomration.location,stringsBundle.getString('response_url_redirect_question'));
		}
		else
		{
			result = torpedo.dialogmanager.createQuestion(600,90,stringsBundle.getString('response_url_redirect_no_verifiable_server'),"","");
		}
		return result;
	}
	return true;
}