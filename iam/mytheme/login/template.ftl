<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="robots" content="noindex, nofollow">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=yes"/>
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"/>
    <title><#nested "title"></title>
    <script>
        window.onload = function() {
            document.getElementById('username').placeholder = 'Email';
            var submitButtonWidth = String(document.getElementsByClassName('btn btn-primary btn-block btn-lg')[0].offsetWidth);
            document.getElementById('username').style.width = submitButtonWidth + 'px';
            if (document.getElementsByClassName('alert').length > 0){
                document.getElementsByClassName('application-name')[0].style.marginBottom = '60px';
            }
        };
    </script>
    <#if properties.styles?has_content>
        <#list properties.styles?split(' ') as style>
            <link href="${url.resourcesPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
</head>

	<body>
        <#-- <#nested "header"> -->
        <div class="login-content" style="background-image: url(&quot;${url.resourcesPath}/img/background.jpg&quot;);">
            <div class="box">
                <#if displayMessage && message?has_content>
                <div class="alert alert-${message.type}">
                <#if message.type = 'success'><span class="${properties.kcFeedbackSuccessIcon!}"></span></#if>
                <#if message.type = 'warning'><span class="${properties.kcFeedbackWarningIcon!}"></span></#if>
                <#if message.type = 'error'><span class="${properties.kcFeedbackErrorIcon!}"></span></#if>
                <#if message.type = 'info'><span class="${properties.kcFeedbackInfoIcon!}"></span></#if>
                <span class="message-text">${message.summary?no_esc}</span>
            </div>
        </#if>
        <div>
                <p class="application-name">FitTrack</p>
        </div>
        <#nested "form">
            <div id="copyright-container">
                <p class="copyright">&copy; ${msg("copyright", "${.now?string('yyyy')}")}</p>
            </div>
            </div> 
        </div>
	</body>
</html>
</#macro>
