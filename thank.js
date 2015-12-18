// Lấy dữ liệu thank
var ucolor = localStorage.getItem('user_color');
		if(ucolor == null){
			ucolor = "#4D4D4D";
		}
		var linktopic = location.pathname.match(/^\/t(\d+)p(\d+)\-.+|^\/t(\d+)\-.+/);
		if(linktopic[3] == undefined){
			var idtopic = linktopic[1];
			var idpage = linktopic[2];
		}
		else{
			var idtopic = linktopic[3];
			var idpage = 0;
		}
$.post('http://php-forumvi.rhcloud.com/thank/',{
	// id topic
	'idtopic': idtopic,
	// Số trang
	'idpage': idpage,
	// Thao tác
	'act': 'get'
}).done(function(mjson){
	objtk = JSON.parse(mjson);
	if(typeof(objtk)== "object"){
		$('.thankbox').each(function(){
			var idtk = $(this).attr('data-id');
			var result = '';
			obj = objtk[idtk];
			if(obj != undefined){
				if(obj.length > 4){
					var length = 5;
				}
				else{
					var length = obj.length;
				}
				for(var j = 0;j < length;j++){
					var block = obj[j];
					var line = '<a title="Vào lúc '+block.time+'" href="/u'+block.id+'" style="color:'+block.color+'">'+block.name+'</a>';
					result += line;
				}
				if(obj.length > 4){
					result += '<span onclick="fullthank(\''+idtk+'\')" class="full-thank"> và '+(obj.length - 5)+' thành viên khác </span>';
				}
				var result = '<div class="showthank" style="opacity:1">'+result+'</div>';
				$(this).html(result);
			}
		});
	}
});
$('.vote_plus[href*="eval=plus&p_vote"]').one('click', function(a) {
   a.preventDefault();
   var b = $(this),
   c = $(".vote_time", b);
   var $post = b.closest(".post");
   var lid = $post.find(".avatar a").attr("href").replace(/.*\/u(\d+).*/, "$1");
   var lname = $post.find(".popmenubutton-new-out a").text();
   var lcolor = $post.find(".popmenubutton-new-out a span").attr('style').replace('color:','');
   b.css("background-image", "url(http://i57.servimg.com/u/f57/17/05/17/70/preloa10.gif)");
  		$.post(this.href, function() {
      	c.text(threeVote(parseInt(c.data("vote"), 10) + 1));
	      $.post("/privmsg", {
	         subject: (new Date).getTime(),
	         message: "Mình thích bài viết của bạn tại [url=http://devs.forumvi.com/" + location.pathname + "?showpost=" + $post.attr("id") + "]" + document.title + "[/url]",
	         username: lname,
	         u: lid,
	         mode: "post_profile",
	         folder: "profile",
	         post: "Send"
	       }, function() {
	         b.removeAttr("style")
	      })
    	});
  		b.attr('href','javascript:;');
	  	var prof = $post.find('.postprofile');
	  	var lthank = prof.find('.prField .label:contains("Reputation")').parent().find('.prContent').text();
	  	var idpost = b.attr('data-id');
		var dt = new Date();
		var date = dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear();
		$.post('http://php-forumvi.rhcloud.com/thank/',{
			// Id bài viết
			'idpost': idpost,
			// Thông tin thành viên đã thank
			'uname':_userdata.username,
			'uid': _userdata.user_id,
			'ucolor': ucolor,
			'upost': _userdata.user_posts,
			'uthank': _userdata.point_reputation,
			'uavata': _userdata.avatar,
			'utime': date,
			// Thông tin thành viên dc thank
			'lname': lname,
			'lid': lid,
			'lthank': lthank,
			'lcolor':lcolor,
			// id topic
			'idtopic': idtopic,
			// Số trang
			'idpage': idpage,
			// Thao tác
			'act': 'save'
		}); 
		var box = $post.find('.thankbox');
		var mem = '<a href="/u'+_userdata.user_id+'" style="color:'+ucolor+'">'+_userdata.username+'</a>';
		if(box.find('.showthank').length == 0){
			box.html('<div class="showthank" style="opacity:1">'+mem+'</div>');
		}
		else{
			box.find('.showthank a:last').after(mem);
		}
});

function fullthank(id){
	var obj = objtk[id];
	var length = obj.length;
	var result = '';
	for(var j = 0;j < length;j++){
		var block = obj[j];
		var line = '<div>';
		line += '<span class="tkavata">' + block.avata.replace(/\\/gi,'') + '</span>';
		line += '<span class="infomem">';
		line += '<p class="nametk"><a href="/u'+block.id+'" style="color '+block.color+'">'+block.name+'</a></p>';
		line += '<p class="userstat">Bài viết: '+block.post+', Được thích: '+block.thank+' </p>';
		line += '</span>';
		line += '<span class="timetk">' + block.time + '</span>';
		line += '</div>';
		result += line;
	}
	var result = '<div  style="width:500px" class="boxmember"><div class="titletk">Có tất cả '+length+' thành viên đã thích bài viết này.</div>' + result + '</div>';
	$.fancybox({ 
        'scrolling'     : 'yes',
        'overlayOpacity': 0.1,
        'showCloseButton'   : false,
         'width': 500,
         closeBtn: false,
        'content' : result
    });
	$('.fancybox-inner').css('overflow','auto').css('overflow-x','hidden');
}
