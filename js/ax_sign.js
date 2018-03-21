(function() {
	// 当前用户信息全是伪造的 只有id等于签名信息上的id才能删除签名 否则会提示没有权限
	var myInfo = {
		name: "王明明",
		id: 2,
		is_draw: true,
		is_boss: true
	};
	// 如果存在表单信息  回显
	if(localStorage.getItem("fillInfo")){
		var fillInfo = JSON.parse(localStorage.getItem("fillInfo"));
		
		$("#name").val(fillInfo.name);
		$("#gender").val(fillInfo.gender);
		$("#birthday").val(fillInfo.birthday);
		$("#education").val(fillInfo.educ);
		$("#hometown").val(fillInfo.hometown);$("#stWorkTime").val(fillInfo.stWorktime);$("#stCWorkTime").val(fillInfo.stcWorkTime);$("#nowDpt").val(fillInfo.nowDpt);
		$("#nowJob").val(fillInfo.nowJob); $("#futDpt").val(fillInfo.futDpt); $("#futJob").val(fillInfo.futJob);
		$("#dptAdvice").val(fillInfo.futDptAdv);$("#admDpt").val(fillInfo.admAdv);$("#managerDpt").val(fillInfo.manaAdv);$("#groupDpt").val(fillInfo.groupAdv); $("#bigBossDpt").val(fillInfo.bigBoss);
	}
	// 初始化创建dom元素
	(function initDom(){
		$("#sign_domWrap").css("position","relative");
		$("#sign_content").html('<div id="signature"></div><div id="div"></div>');
		$("#sign_content").css({"position": "absolute","top": 0,"left": 0,"right": 0,"bottom": "30px","z-index":"-1","overflow": "hidden"});
		$("#content_wrap").height(($("#content_wrap").height()-30));
		$("#content_wrap").children(":last-child").css("margin-bottom","40px");
		$("#signature").css({"position": "absolute","top": 0,"left": 0,"width": "100%"});
		$(".sign_btns").html('<button id="start">开始</button><button id="yes">完成</button><button id="reset">重置</button><button id="clear">清除所有签名记录</button>');
		$(".sign_btns").css({"position": "fixed","bottom": 0,"z-index": 55,"padding": "5px"});
		// 获取签名页面宽高
		var hWidth = $("html").width(),hHeight = $("html").height();
		$(".jSignature").attr("width",hWidth);
		$(".jSignature").attr("height",(hHeight));
	})()
	
	// 获取当前时间的封装
	function getTime() {
		var now = new Date();
		return now.getFullYear() + "-" + toTwo(Number(now.getMonth()+ 1))   + "-" + toTwo(now.getDate())  + " " + toTwo(now.getHours())  + ":" + toTwo(now.getMinutes())  + ":" + toTwo(now.getSeconds()) ;
	}
	function toTwo(str){
		return  str < 10 ? "0"+str : str
	}
	
	// 判断是否存在签名信息
	if(localStorage.getItem("eachInfo")) {
		// 已经有一个签名了  获取签名者信息（姓名 时间）
		var username = "王明明"; // 需更改为登陆者的账户名称
		$("#sign_content").css("z-index", "10"); // 表单信息不可再更改
		var allInfo = JSON.parse(localStorage.getItem("eachInfo"));
		var imgDiv = "";
		// 图片高度应该是自身比例和设备
		for(var i in allInfo) {
			imgDiv += '<div class="assignDiv"></div>';
		};
		$("#div").html(imgDiv);
		var block = 50;
		$(".assignDiv").each(function(i){
			var each_info = allInfo[i];
			each_info.xMin = each_info.xMin-(block/2) > 0 ? (each_info.xMin-(block/2)) : each_info.xMin;
			each_info.xMax = each_info.xMax+(block/2);
			each_info.yMin = each_info.yMin-(block/2) > 0 ? (each_info.yMin-(block/2)) : each_info.yMin;
			each_info.yMax = each_info.yMax+(block/2);
			
			$(this).html('<p class="sign_userInfo">签名人：'+username+'<br>时间：'+each_info.time+'</p>')
			$(this).css({"width":each_info.xDis+block,"height":each_info.yDis+block,"background":"url("+each_info.src+") no-repeat center","background-position":"-"+each_info.xMin+"px -"+each_info.yMin+"px"})
			$(this).css({"position":"absolute","top":each_info.yMin,"left":each_info.xMin});
			$(this).hover(function(){
				$(this).children(".sign_userInfo").show();
			},function(){
				$(this).children(".sign_userInfo").hide();
			})
		})
		
	}
	var procedure = false;  // 是否开始
	var $sigdiv = $("#signature");
	// 开始签名 按钮
	$("#start").click(function() {
		mui.toast("请开始签名");
		$("#sign_content").css("z-index", "10");
		
		// 获取表单信息
		var name = $("#name").val(),gender = $("#gender").val(),birthday = $("#birthday").val(),educ = $("#education").val(),
			hometown = $("#hometown").val(),stWorktime = $("#stWorkTime").val(),stcWorkTime = $("#stCWorkTime").val(),
			nowDpt = $("#nowDpt").val(),nowJob = $("#nowJob").val(),futDpt = $("#futDpt").val(),futJob = $("#futJob").val(),
			futDptAdv = $("#dptAdvice").val(),admAdv = $("#admDpt").val(),manaAdv = $("#managerDpt").val(),groupAdv = $("#groupDpt").val(),bigBoss = $("#bigBossDpt").val();
		var fillInfo = {
			name:name,
			gender:gender,
			birthday:birthday,
			educ:educ,
			hometown:hometown,
			stWorktime:stWorktime,
			stcWorkTime:stcWorkTime,
			nowDpt:nowDpt,
			nowJob:nowJob,
			futDpt:futDpt,
			futJob:futJob,
			futDptAdv:futDptAdv,
			admAdv:admAdv,
			manaAdv:manaAdv,
			groupAdv:groupAdv,
			bigBoss:bigBoss
		};
		localStorage.setItem("fillInfo",JSON.stringify(fillInfo))
		
		if(!procedure) {
			// 获取页面高度 使之可以在整个页面上进行绘制
			var contHeight = $("#sign_content").height();
			$("#signature").height(contHeight);
			$("#signature").css("z-index", "12");
			$sigdiv.jSignature(); // 初始化jSignature插件.
			procedure = true; // 表示已点击了开始按钮
		} else {
			mui.toast("你已经点击了开始按钮了，请在页面上进行签名吧");
			return false;
		}
	});

	// 结束事件
	var finished = false;  // 是否结束 false表示未点击结束按钮
	var srcArr = [];
	var reseted = false;  // 是否点击过重置 点击后为true 则不能点击完成
	
	$("#yes").click(function() {
		var id = 0;
		reseted = false;
		if(procedure) {
			if(!finished) {
				if(localStorage.getItem("eachInfo")) {
					var parse_info = JSON.parse(localStorage.getItem("eachInfo"));
					srcArr = srcArr.concat(parse_info);
					id = parse_info.length;
				};
				if(reseted){
					mui.toast("请在页面上进行绘制签名");
					return false;
				};
				if(xDis == 0 || yDis == 0 ){
					mui.toast("还没有签名")
					return false;
				}else{
					//将画布内容转换为图片
					var datapair = $sigdiv.jSignature("getData", "image");
					var i = new Image();
					var src = "data:" + datapair[0] + "," + datapair[1];
					i.src = src;
					var time = getTime();
					var eachInfo = {
						id: id,
						num: srcArr.length,
						time: time,
						src: src,
						xDis: xDis,
						yDis: yDis,
						xMax: xMax,
						xMin: xMin,
						yMin: yMin,
						yMax: yMax
					}
					srcArr.push(eachInfo);
					localStorage.setItem("eachInfo", JSON.stringify(srcArr));
					
					// 获取图片width height
					finished = true;
					mui.toast("已完成签名");
					setTimeout(function(){
						window.location.reload();
					},2000) 
				}
			} else {
				mui.toast("已完成当前签名");
				return false;
			}

		} else {
			mui.toast("请先点击开始按钮")
			return false;
		}
	});

	$("#reset").click(function(){
		var allInfo = JSON.parse(localStorage.getItem("eachInfo"));
		if(procedure && !finished){
			// 没有完成当前签名    如果是还没有刷新后的删除动作，则重置画布
			mui.confirm("您还没有点击完成签名，确认重置吗","重置签名",["取消","确定"],function(e){
				if(e.index === 1){
					$sigdiv.jSignature();
					$sigdiv.jSignature("reset"); //重置画布，可以进行重新作画.
					reseted = true;
				}
			})
		}else{
			if(!allInfo || allInfo.length < 1){
				mui.toast("签名板上没有任何签名");
			}else{
				// 已存在签名
				var _self = false,i_id=0;
				for(var i in allInfo){
					if(myInfo.id == allInfo[i].id){
						console.log("本人");
						i_id = i;
						_self = true;
					}
				};
				if(!_self){
					mui.toast("抱歉，您没有权限进行此操作");
					return false;
				}else{
					// 有权限时 删除当前用户的签名信息
					// 如果是删除刷新后的签名信息，则需要清除本地存储
					mui.toast("已删除您的所有签名信息")
					allInfo.splice(i_id,1);
					console.log(allInfo)
					localStorage.setItem("eachInfo",JSON.stringify(allInfo))
					setTimeout(function(){
						window.location.reload();
					},1500)
					
				}
			}
		}
		
	});
	
	// 清除所有签名
	$("#clear").click(function(){
		if(myInfo.is_boss){
			mui.confirm("确认清除所有签名吗","清除所有签名",["取消","确定"],function(e){
				if(e.index === 1){
					localStorage.clear();
					mui.toast("已清除页面所有签名");
					setTimeout(function(){
						window.location.reload();
					},500)
				}
			})
		}else{
			mui.toast("抱歉，您没有权限进行此操作")
		}
		
	})
}(window))