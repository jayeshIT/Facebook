Alloy.Globals.fb = require('facebook');
Alloy.Globals.fb.appid = 1491892524374328;
Alloy.Globals.fb.permissions = ['publish_stream', 'read_stream', 'email', 'user_location', 'user_videos', 'user_birthday', 'user_actions.video', 'user_photos', 'export_stream', 'photo_upload', 'read_friendlists', 'status_update', 'xmpp_login', 'video_upload', 'user_actions.video'];
Alloy.Globals.fb.forceDialogAuth = true;

var btn = Titanium.UI.createButton({
	top : 10,
	left : 10,
	title : 'Facebook Login'
});
var btn2 = Titanium.UI.createButton({
	top : 10,
	right : 10,
	title : 'Facebook Logout'
});

btn.addEventListener('click', function(e) {

	if (Alloy.Globals.fb.loggedIn) {
		Alloy.Globals.facbook_login();
	} else {
		Alloy.Globals.fb.authorize();
	}
});
btn2.addEventListener('click', function(e) {
	if (Alloy.Globals.fb.loggedIn) {
		Alloy.Globals.fb.logout();
	} else {
		alert('Please Login to Facebook');
	}
});
$.index.add(btn);
$.index.add(btn2);

var facebook_login = function(e) {
	if (e.success) {
		Titanium.App.Properties.setString('token', Alloy.Globals.fb.getAccessToken());
		Alloy.Globals.facbook_login();
	} else if (e.cancelled) {
		Ti.API.info('Facebook login cancelled');
	} else if (e.error) {
	} else {
		Alloy.Globals.fb.logout();
	}
};
Alloy.Globals.fb.addEventListener('login', facebook_login);
Alloy.Globals.fb.addEventListener('logout', function(e) {
	Titanium.App.Properties.removeProperty('token');
	var client = Titanium.Network.createHTTPClient();
	client.clearCookies('https://login.facebook.com');
});
Alloy.Globals.facbook_login = function() {
	var xhr = Ti.Network.createHTTPClient();
	Titanium.App.Properties.removeProperty('login_user');
	xhr.open("GET", 'https://graph.facebook.com/?ids=' + Alloy.Globals.fb.uid + '&access_token=' + Titanium.App.Properties.getString('token'));
	xhr.setTimeout(1000);
	xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	xhr.onload = function() {
		Ti.API.info('onload this.responseText :' + this.responseText);
		if (this.responseText !== null) {
			Titanium.App.Properties.setString('login_user', this.responseText);
			Titanium.App.Properties.setString('image', "https://graph.facebook.com/" + Alloy.Globals.fb.uid + "/picture?type=large");
			Titanium.App.Properties.setString('uid', Alloy.Globals.fb.uid);
			var expireIn = (Alloy.Globals.fb.expirationDate).toISOString();
			alert('UID' + Alloy.Globals.fb.uid);
		}
	};
	xhr.onerror = function() {
		Ti.API.info('onerror this.responseText :');
		alert("Server not responding /n Please try again.");
		if (Alloy.Globals.fb.loggedIn) {
			Alloy.Globals.fb.logout();
		}
	};
	xhr.send();
};

$.index.open();
