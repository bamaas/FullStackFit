<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=social.displayInfo; section>
    <#if section = "title">
        ${msg("loginTitle",(realm.displayName!''))}
    <#elseif section = "header">
        <#-- <script>
            function togglePassword() {
                var x = document.getElementById("password");
                var v = document.getElementById("vi");
                if (x.type === "password") {
                    x.type = "text";
                    v.src = "${url.resourcesPath}/img/eye.png";
                } else {
                    x.type = "password";
                    v.src = "${url.resourcesPath}/img/eye-off.png";
                }
            }
        </script> -->
    <#elseif section = "form">
        <#-- <div>
            <img class="logo" src="${url.resourcesPath}/img/fittrack-logo.svg" alt="FitTrack">
        </div> -->
        <div class="box-container">
        <#if realm.password>
            <div>
               <form id="kc-form-login" class="form" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
                    <input id="username" class="login-field" placeholder="${msg("username")}" type="text" name="username" tabindex="1">
                    <div>
                        <label class="visibility" id="v" onclick="togglePassword()"><img id="vi" src="${url.resourcesPath}/img/eye-off.png"></label>
                    </div>
                <input id="password" class="login-field" placeholder="${msg("password")}" type="password" name="password" tabindex="2">
                <input class="submit" type="submit" value="${msg("doLogIn")}" tabindex="3">
                </form>
                <div class="${properties.kcFormOptionsWrapperClass!}" id="forgot-pw">
                    <#if realm.resetPasswordAllowed>
                        <span><a class="forgot-password" href="${url.loginResetCredentialsUrl}">${msg("doForgotPassword")}</a></span>
                    </#if>
                    <#if realm.password && realm.registrationAllowed && !usernameEditDisabled??>
                            <span> | <a class="forgot-password" tabindex="6" href="${url.registrationUrl}">${msg("doRegister")}</a></span>
                    </#if>
                </div>
            </div>
        </#if>
        <#if social.providers??>
            <p class="para">${msg("selectAlternative")}</p>
            <div id="social-providers">
                <#list social.providers as p>
                <input class="social-link-style" type="button" onclick="location.href='${p.loginUrl}';" value="${p.displayName}"/>
                </#list>
            </div>
        </#if>
    </#if>
</@layout.registrationLayout>
