(function() {
	// 当前用户信息全是伪造的 只有id等于签名信息上的id才能删除签名 否则会提示没有权限
	var myInfo = {
		name: "王明明",
		id: 2,
		is_draw: true,
		is_boss: true
	};
	// 如果存在表单信息  渲染页面
	if(localStorage.getItem("formInfo")){
		var formInfo = JSON.parse(localStorage.getItem("formInfo"));
		console.log(formInfo)
		for(var i = 0; i < formInfo.ic.length; i++){
			var el = null;
			var _this = formInfo.ic[i]
			if(_this == "id"){
				el = $("#"+formInfo.k[i]);
			}else{
				el = $('input[name="'+formInfo.k[i]+'"]');
			}
			el.val(formInfo.v[i])
		}
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
	function isIE() {
		if (!!window.ActiveXObject || "ActiveXObject" in window){
			return true;
		}else{
			return false;
		}
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
	
	
//	localStorage.clear();
	// 开始签名 按钮
	$("#start").click(function() {
		mui.toast("请开始签名");
		$("#sign_content").css("z-index", "10");
		
		// 循环所有表单信息 并获取表单信息
		var formInfo = {ic:[],k:[],v:[]};
		$("input,select,textarea").each(function(i){
			// 判断是否存在id或class或name属性
			if($(this).attr("id") !== "" || $(this).attr("name") !== "" ){
				var k = $(this).attr("id") ? $(this).attr("id") : $(this).attr("name"), v = $(this).val();
				var ic = $(this).attr("id") ? "id" : "name";
				formInfo.ic.push(ic);
				formInfo.k.push(k);
				formInfo.v.push(v);
			}else{
				$(this).attr("name",$(this).context.tagName+i);
				var ic = $(this).context.tagName;
				var k = $(this).attr("name"),v = $(this).val();
				formInfo.ic.push(ic);
				formInfo.k.push(k);
				formInfo.v.push(v)
			}
		})
		localStorage.setItem("formInfo",JSON.stringify(formInfo))
		
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
		
		if(procedure) {
			if(!finished) {
				if(localStorage.getItem("eachInfo")) {
					var parse_info = JSON.parse(localStorage.getItem("eachInfo"));
					srcArr = srcArr.concat(parse_info);
					id = parse_info.length;
				};
				if(xDis > 0){
					reseted = false;
				}
				if(reseted){
					mui.toast("请在页面上进行签名绘制");
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
//					localStorage.setItem("finished",true)
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
		
			//以下是调用上面的函数
			if (isIE()) {
				if(xDis == 0){
					mui.toast("请在页面上进行签名绘制");
					return false;
				}
				var conf = confirm("您还没有点击完成签名，确认重置吗") ;
				if(conf){
					$sigdiv.jSignature();
					$sigdiv.jSignature("reset"); //重置画布，可以进行重新作画.
					reseted = true;  // 已点击过重置按钮 应该继续绘制签名
					xDis = 0;yDis=0;
				}
			}else{
				mui.confirm("您还没有点击完成签名，确认重置吗","重置签名",["取消","确定"],function(e){
					if(e.index === 1){
						$sigdiv.jSignature();
						$sigdiv.jSignature("reset"); //重置画布，可以进行重新作画.
						reseted = true;  // 已点击过重置按钮 应该继续绘制签名
					}
				})
			}
		}else{
			if(!allInfo || allInfo.length < 1){
				mui.toast("签名板上没有任何签名");
			}else{
				// 已存在签名
				var _self = false,i_id=0;
				for(var i in allInfo){
					if(myInfo.id == allInfo[i].id){
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
		if(localStorage.getItem("eachInfo")){
			// 最大权限 可删除所有信息
			if(myInfo.is_boss){
				// 兼容IE的信息确认框
				if (isIE()) {
					var conf = confirm("确认清除所有签名吗");
					if(conf){
						localStorage.removeItem("eachInfo");
						mui.toast("已清除页面所有签名");
						setTimeout(function(){
							window.location.reload();
						},500)
					}
				}else{
					mui.confirm("确认清除所有签名吗","清除所有签名",["取消","确定"],function(e){
						if(e.index === 1){
							localStorage.removeItem("eachInfo");
							mui.toast("已清除页面所有签名");
							setTimeout(function(){
								window.location.reload();
							},500)
						}
					})
				}
			}else{
				mui.toast("抱歉，您没有权限进行此操作")
			}
		}else{
			// 没有完成当前签名
			if(procedure && !finished){
				mui.toast("请先完成当前签名的绘制");
				return false;
			}
			// 页面上没有任何签名时没有删除
			mui.toast("页面上没有任何签名，请开始绘制签名");
			return false;
		}
		
	})
}(window))