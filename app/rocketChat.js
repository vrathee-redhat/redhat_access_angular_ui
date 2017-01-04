
(function(w, d, s, u) {
		w.RocketChat = function(c) { w.RocketChat._.push(c) }; w.RocketChat._ = []; w.RocketChat.url = u;
		var h = d.getElementsByTagName(s)[0], j = d.createElement(s);
		j.async = true; j.src = 'http://rocket.gss.redhat.com/packages/rocketchat_livechat/assets/rocket-livechat.js';
		h.parentNode.insertBefore(j, h);
})(window, document, 'script', 'http://rocket.gss.redhat.com/livechat');

