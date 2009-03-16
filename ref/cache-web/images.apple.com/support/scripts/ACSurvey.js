var ACSurvey={'applenet':false,'enabled':true,'sampling':1,'entryPageOnly':true,'locale':'en_US','languages':['da','nl','fi','fr','de','it','no','pl','pt','ru','es','sv','en'],'check':function(){if(ACSurvey.strings!==undefined&&document.getElementById('globalheader')&&ACSurvey.enabled&&!ACSurvey.applenet&&!ACSurvey.ignoreBrowser()&&ACSurvey.isSelected()){var a=document.createElement("center");var b='<div id="survey" style="background: url(http://images.apple.com/support/images/survey_bg.gif) top left no-repeat; font-size: 11px; line-height: 13px; padding: 7px 0px 0px 5px; width: 680px; height:50px; margin-top: 10px; margin-bottom:10px;">';b+='<div id="surveytext" style="overflow:hidden;height:37px;font-size: 11px; padding: 0px 0px 5px 70px; width:480px; text-align:left; float: left;">'+ACSurvey.strings['invited']+'</div>';b+='<div><div id="surveybuttons" style="float: right; padding-top: 13px; padding-right: 5px; color: #a1a5a9; height: 25px; width: 120px;"><a href="javascript:void(0);" onclick="ACSurvey.openInvitation();return false;" style="background-color:#f4b428; border:1px solid #d17d1a; font-size:12px; line-height:16px;color:#FFF; font-weight:bold; text-decoration: none; padding-left: 6px; padding-right: 6px; padding-top: 2px; padding-bottom:4px; margin-right:10px;">'+ACSurvey.strings['yes']+'</a> ';b+='<a href="javascript:void(0);" onclick="ACSurvey.closeInvitation();return false;" style="background-color:#f4b428; border:1px solid #d17d1a; font-size:12px; color:#FFF; font-weight:bold; text-decoration: none; padding-left: 8px; padding-right: 8px; padding-top: 2px; padding-bottom:4px; ">'+ACSurvey.strings['no']+'</a></div></div>';b+='</div>';a.innerHTML=b;document.getElementsByTagName('body')[0].insertBefore(a,document.getElementById('globalheader').nextSibling)}else if(ACSurvey.applenet){ACSurvey.setACSurveyCookie()}else if(ACSurvey.strings===undefined&&typeof console!='undefined'){console.log('ACSurvey.js: Could not find survey strings for '+ACSurvey.locale)}},'ignoreBrowser':function(){var a=navigator.appName+" "+navigator.appVersion;a=a.toUpperCase();if(a.indexOf("WEBTV")!=-1||a.indexOf("OPERA")!=-1||a.indexOf("MOBILE")!=-1){return true}return false},'getBrowserLanguage':function(){var a=((navigator.browserLanguage)?navigator.browserLanguage:(navigator.language)?navigator.language:navigator.userLanguage);var b=a.split('-');var c=b[0].toLowerCase();if(c=='nb')c='no';else if(c=='se')c='sv';else if(c=='dk')c='da';return c},'openInvitation':function(){document.getElementById('surveytext').innerHTML=ACSurvey.strings['thankyou'];document.getElementById('surveybuttons').innerHTML="<a href='javascript:ACSurvey.closeInvitation();' style='background: url(http://images.apple.com/support/images/survey_close.gif) left top no-repeat; display: block; padding-left: 13px;text-align:left; font-size:10px; color:#c7650c; text-decoration: underline;'>"+ACSurvey.strings['close']+"</a>";var a=this.getBrowserLanguage();if(ACSurvey.locale=='en_US'&&a=='en'){ACSurvey.launchAdvanis()}else{ACSurvey.launchMedallia()}},'launchAdvanis':function(){var a="https://esurvey.advanis.ca/applecare2/index.php?ep="+escape(location.href).replace(/\//g,"%2F");a+="&loc="+escape(ACSurvey.locale);a+="&blang="+escape(this.getBrowserLanguage());a+="&sec="+escape(this.detectSection()).replace(/\//g,"%2F");var b=ACSurvey.readCookie('chatexit');if(b){var c=ACSurvey.parser(b,"%20%3A%20",6);c=ACSurvey.parser(c,"%0A",0);a+="&sn="+escape(ACSurvey.encode(c))}var d=ACSurvey.readCookie('s_vi');if(d){a+="&sitecat="+escape(d)}ACSurvey.popupBehind(a,770,675)},'launchMedallia':function(){var a="http://survey.medallia.com/applesupportweb?ep="+escape(location.href).replace(/\//g,"%2F");a+="&loc="+escape(ACSurvey.locale);a+="&blang='"+escape(this.getBrowserLanguage())+"'";a+="&sec="+escape(this.detectSection()).replace(/\//g,"%2F");var b=ACSurvey.readCookie('s_vi');if(b){a+="&sitecat="+escape(b)}ACSurvey.popupBehind(a,770,675)},'detectSection':function(){var a=location.href.match(/^https?\:\/\/www\.apple\.com\/.{0,6}support\//);if(a!=null){return a}else{var b=location.href.split('/');if(b[2]=='support.apple.com'||b[2]=='discussions.apple.com'||b[2]=='docs.info.apple.com'||b[2]=='www.info.apple.com'||b[2]=='depot.info.apple.com'||b[2]=='search.info.apple.com'||b[2]=='service.info.apple.com'||b[2]=='signin.info.apple.com')return b[0]+'//'+b[2]+'/';return'Other'}},'popupBehind':function(a,b,c){var d="invite";var e="toolbar=no,menubar=no,resizable=yes,scrollbars=1,top=0,left=0,width="+b+",height="+c;var f=open(a,d,e);window.focus()},'closeInvitation':function(){document.getElementById('survey').style.visibility="hidden";document.getElementById('survey').style.display="none"},'isSelected':function(){var a=ACSurvey.getCookie('ac_survey');var b=false;if(a!='1'&&ACSurvey.sampling!=0){var c=parseInt((Math.random()*ACSurvey.sampling)+1);if(c==2||c==1){b=true}}if(ACSurvey.entryPageOnly||(!ACSurvey.entryPageOnly&&b)){ACSurvey.setACSurveyCookie()}return b},'setACSurveyCookie':function(){var a=new Date();a.setDate(a.getDate()+90);ACSurvey.setCookie('ac_survey','1',a,"/",".apple.com")},'loadSurveyData':function(){var a=ACSurvey.getCookie("POD");var b=ACSurvey.locale;if(a!=null&&a!=''){var c=a.substring(a.indexOf('~')+1,a.length);var d=a.substring(0,a.indexOf('~')).toUpperCase();b=c+"_"+d}b=(b=='en_GB')?'en_UK':b;ACSurvey.loadScript("http://images.apple.com/support/scripts/ac_survey/ac_survey_data_"+b+".js");ACSurvey.locale=b},'loadSurveyVariables':function(){ACSurvey.loadScript("http://www.apple.com/support/scripts/survey/survey_control.php")},'loadScript':function(a){var b=document.getElementsByTagName("head").item(0);var c=document.createElement("script");c.setAttribute("charset","utf-8");c.setAttribute("src",a);c.setAttribute("id","surveyData");b.appendChild(c)},'getCookie':function(a){var b=null;var c=" "+document.cookie+";";var d=" "+a+"=";var e=c.indexOf(d);var f;if(e!=-1){e+=d.length;f=c.indexOf(";",e);b=unescape(c.substring(e,f))}return b},'setCookie':function(a,b,c,d,e){var f=(c==null)?"":"; expires="+c.toGMTString();var g=(d==null)?"":"; path="+d;var h=(e==null)?"":"; domain="+e;document.cookie=a+"="+escape(b)+f+g+h},'readCookie':function(a){var b=a+"=";var d=document.cookie.split(';');for(var i=0;i<d.length;i++){var c=d[i];while(c.charAt(0)==' ')c=c.substring(1,c.length);if(c.indexOf(b)==0)return c.substring(b.length,c.length)}return null},'parser':function(a,b,c){var d=a.split(b);return d[c]},'encode':function(a){var b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var c="";var d,chr2,chr3="";var e,enc2,enc3,enc4="";var i=0;do{d=a.charCodeAt(i++);chr2=a.charCodeAt(i++);chr3=a.charCodeAt(i++);e=d>>2;enc2=((d&3)<<4)|(chr2>>4);enc3=((chr2&15)<<2)|(chr3>>6);enc4=chr3&63;if(isNaN(chr2)){enc3=enc4=64}else if(isNaN(chr3)){enc4=64}c=c+b.charAt(e)+b.charAt(enc2)+b.charAt(enc3)+b.charAt(enc4);d=chr2=chr3="";e=enc2=enc3=enc4=""}while(i<a.length);return c},'addLoadEvent':function(a){var b=window.onload;if(typeof window.onload!='function'){if(window.onload){window.onload=a}else{var c=window.addEventListener||document.addEventListener;var d=window.attachEvent||document.attachEvent;if(c){c('load',a,true);return true}else if(d){var e=d('onload',a);return e}else{return false}}}else{window.onload=function(){b();a()}}}};if(ACSurvey.getCookie('ac_survey')==null){ACSurvey.loadSurveyVariables();ACSurvey.loadSurveyData();ACSurvey.addLoadEvent(function(){ACSurvey.check()})}