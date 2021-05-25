<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="robots" content="noindex, nofollow">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=yes"/>
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"/>
    <script async defer data-domain="doyoueventrack.app" src="https://plausible.basmaas.nl/js/plausible.js"></script>
    <title><#nested "title"></title>
    <script>
        window.onload = function() {
            let usernameElement = document.getElementById('username');
            if (usernameElement) usernameElement.placeholder = 'Email';
            if (document.getElementsByClassName('alert').length > 0){
                document.getElementsByClassName('application-name')[0].style.marginBottom = '60px';
            }
            if (document.getElementsByClassName('btn btn-primary btn-block btn-lg').length > 0) {
                var submitButtonWidth = String(document.getElementsByClassName('btn btn-primary btn-block btn-lg')[0].offsetWidth);
                document.getElementById('username').style.width = submitButtonWidth + 'px';
            }
            if ((window.location.href).includes('execution=VERIFY_EMAIL')){
                document.getElementsByClassName('alert-warning')[0].setAttribute('style', ('height: 0px;'));
                document.getElementsByClassName('message-text')[0].setAttribute('style', ('line-height: 1; top: 40px;'));
                document.getElementsByClassName('instruction')[0].setAttribute('style', ('padding-top: 40px;'));
            }
            if ((window.location.origin).includes('test')){
                let logo = document.getElementById('logo-ahref');
                logo.setAttribute('href', 'https://test-auth.doyoueventrack.app/auth/realms/FitTrack/protocol/openid-connect/auth?client_id=fittrack-application&response_type=code&scope=openid%20email&redirect_uri=https://test-bro.doyoueventrack.app&kc_locale=nl')
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
            <a id="logo-ahref" href="https://auth.doyoueventrack.app/auth/realms/FitTrack/protocol/openid-connect/auth?client_id=fittrack-application&response_type=code&scope=openid%20email&redirect_uri=https://bro.doyoueventrack.app&kc_locale=nl" style="text-decoration: none;">
                <p class="application-name">Do You Even Track</p>
            </a>
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
