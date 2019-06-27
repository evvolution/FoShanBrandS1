/*
	note : 19年品牌佛山活动
	author : zx
	date : 2019-6-3
*/

$(document).ready(function(){
	setScrollheight();
	get_S1_list1();
	get_S1_list2();
	checkSigned();
	stateControl();
	voteControl();
	bindBasicBTNs();
});


//页面初始化
window.onload = function() {
    var navSwiper = new Swiper('#header', {
        freeMode: true,
        slidesPerView: 'auto',
        freeModeSticky: true,
    });

    var tabsSwiper = new Swiper('#tabs-container', {
        speed: 500,
        on: {
            slideChangeTransitionStart: function() {
                $(".tabs .active").removeClass('active');
                $(".tabs a").eq(this.activeIndex).addClass('active');
            }
        }
    })
    $(".tabs a").on('click', function(e) {
        e.preventDefault()
        $(".tabs .active").removeClass('active')
        $(this).addClass('active')
        tabsSwiper.slideTo($(this).index())
    })

}

function setScrollheight(){
	var availHeight = window.screen.availHeight;
	if(availHeight < 700){
		$(".list-group").css("height", availHeight*0.48);
		$("#introcontent").css("height", availHeight*0.5);
	}else if(availHeight > 700){
		$(".list-group").css("height", availHeight*0.58);
		$("#introcontent").css("height", availHeight*0.6);
	}
	
}


function get_S1_list1(){
	$.ajax({
		type:"get",
		url:"http://172.16.17.100:8777/exam/get_vote/?exam_id=9&openid=12345",
		dataType:"json",
		success:function(data){
			var listcontent = "";
			var modalcontent = "";
			for (var i=0; i<data.projects[0].length; i++){
				var head = '<li class="list-group-item">';
				var order = '<span class="list-order"><strong>' + (i+1) + '</strong></span>';
				var name = '<div class="list-mixcontent" data-toggle="modal" data-target="#s1Info' + data.projects[0][i].id + '"><span class="list-co">' + data.projects[0][i].title + '</span><span class="list-current">（当前票数：' + data.projects[0][i].vote_count + '）</span></div>';
				var pic = '<span class="list-pic" data-toggle="modal" data-target="#s1Info' + data.projects[0][i].id + '"><img class="list-pic-in" src="' + data.projects[0][i].pic_url + '" /></span>';
				var checkbox = '<input onclick=stateControl("s1-list1-checkbox","s1-list1-num","s1-list1-state") type="checkbox" name="s1-list1-checkbox" class="fspCheckBox" value="' + data.projects[0][i].item_id + '"/ >';
				var tail = '</li>';

				listcontent += (head + order + name + pic + checkbox + tail);

				var modalhead = '<div class="modal fade" id="s1Info' + data.projects[0][i].id + '" tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content">';
				var modalbody = '<div class="modal-body" style="padding:0;"><div class="form-group" style="text-align:center;"><h4 style="color:#ffe200;">品牌介绍</h4><br/></div><div class="form-group"><div class="s1-details-modalcontent">' + data.projects[0][i].content + '</div></div></div><div class="modal-footer"><div style="color:#188ae2;" data-dismiss="modal">关闭</div></div>'
				var modaltail = '</div></div></div>';

				modalcontent += (modalhead + modalbody + modaltail);

			}
			$("#s1-list1-list").html(listcontent);
			$("#s1-list1-details-modal").html(modalcontent);
		},
		error: function(){
            console.log('很抱歉，获取数据出错，请稍候再试！');
            alert("当前投票人数过多，请稍后重试");
        }
     })
}



function get_S1_list2(){
	$.ajax({
		type:"get",
		url:"http://172.16.17.100:8777/exam/get_vote/?exam_id=8&openid=12345",
		dataType:"json",
		success:function(data){
			var listcontent = "";
			var modalcontent = "";
			for (var i=0; i<data.projects[0].length; i++){
				var head = '<li class="list-group-item">';
				var order = '<span class="list-order"><strong>' + (i+1) + '</strong></span>';
				var name = '<div class="list-mixcontent" data-toggle="modal" data-target="#s2Info' + data.projects[0][i].id + '"><span class="list-co">' + data.projects[0][i].title + '</span><span class="list-current">（当前票数：' + data.projects[0][i].vote_count + '）</span></div>';
				var pic = '<span class="list-pic" data-toggle="modal" data-target="#s2Info' + data.projects[0][i].id + '"><img class="list-pic-in" src="' + data.projects[0][i].pic_url + '" /></span>';
				var checkbox = '<input onclick=stateControl("s1-list2-checkbox","s1-list2-num","s1-list2-state") type="checkbox" name="s1-list2-checkbox" class="fspCheckBox" value="' + data.projects[0][i].item_id + '"/ >';
				var tail = '</li>';

				listcontent += (head + order + name + pic + checkbox + tail);

				var modalhead = '<div class="modal fade" id="s2Info' + data.projects[0][i].id + '" tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content">';
				var modalbody = '<div class="modal-body" style="padding:0;"><div class="form-group" style="text-align:center;"><h4 style="color:#ffe200;">品牌介绍</h4><br/></div><div class="form-group"><div class="s1-details-modalcontent">' + data.projects[0][i].content + '</div></div></div><div class="modal-footer"><div style="color:#188ae2;" data-dismiss="modal">关闭</div></div>'
				var modaltail = '</div></div></div>';

				modalcontent += (modalhead + modalbody + modaltail);

			}
			$("#s1-list2-list").html(listcontent);
			$("#s1-list2-details-modal").html(modalcontent);
		},
		error: function(){
            console.log('很抱歉，获取数据出错，请稍候再试！');
            alert("当前投票人数过多，请稍后重试");
        }
     })
}


/*
 * note:每当有指定系列的checkbox选中，则检测当前状态以写入进度条
*/
function stateControl(name, num, scroll){

	var checkedItems = $('input[name=' + name + ']:checked');
	var uncheckedItems = $('input[name=' + name + ']:not(:checked)');
	var state = checkedItems.length;
	if(state === 10){
		$('#' + num).html('<span style="color:green">上限</span>');
		$('input[name=' + name + ']:not(:checked)').each(function(){
			$(this).attr('disabled',true);
		});
	}else if((state < 5) && ((state > 0) || (state === 0))){
		$('#' + num).html('<span style="color:#ee3434">' + state + '</span>/10');
		$('input[name=' + name + ']').each(function(){
			$(this).attr('disabled',false);
		});
	}else if((state < 10) && (state > 4)){
		$('#' + num).html('<span style="color:green">' + state + '</span>/10');
		$('input[name=' + name + ']').each(function(){
			$(this).attr('disabled',false);
		});
	}else if(state > 10){
		alert("当前榜单您最多选择10项");//这个不可能触发的
		return;
	}
	var stateByPercentform = 'width:' + state*10 + '%';
	$('#' + scroll).attr("style", stateByPercentform);
}


function bindBasicBTNs(){
	$("#showrules").click(function(){
		$('#introModal').modal();
	});

	$("#reselect").click(function(){
		$('input[name=s1-list1-checkbox]:checked').each(function(){
			$(this).prop("checked",false);
			clearChosen();

		});
		$('input[name=s1-list2-checkbox]:checked').each(function(){
			$(this).prop("checked",false);
			clearChosen();
		});
	});
}

function clearChosen(){
	$("#s1-list1-state").attr("style", 'width:0%');
	$("#s1-list2-state").attr("style", 'width:0%');
	$("#s1-list1-num").html("0/10");
	$("#s1-list2-num").html("0/10");
}


/*  投票和信息登记的取消按钮，取消时清空已经填入的内容 */
function clearWastedInfo(item){
	$('#' + item).val("");
}


function voteControl(){
	$("#confirmVote").click(function(){
		var enable = checkTimes();
		alert(enable);
		if(enable === "enable"){
			var s1l1num = $('input[name=s1-list1-checkbox]:checked').length;
			var s1l2num = $('input[name=s1-list2-checkbox]:checked').length;
			if((s1l1num < 5) || (s1l2num < 5)){
				alert("您还未完成投票，每个榜单至少需要选择5项");
				return;
			}
			var userSigned = checkSigned();
			if( (!((s1l1num < 5) || (s1l2num < 5))) && (userSigned != "userSigned")){
				/* 判断用户是否提交了个人信息 */
				alert("您还未完善个人信息");

				/* 此时的用户具有投票权限，并且已经给出了满足投票规则的选择，所以当前的提交按钮需要跳转至获取验证码的模态框*/
				$("#uploadinfo-in").css('display','none');
				$("#uploadinfo-final").css('display','noneinline-block');

				$('#getuserinfomodal').modal();
				return;
			}else{
				getCodePic();
				$('#votemodal').modal();
			}
		}else if(enable === "disable"){
			alert("您当日投票次数已达上限，请明天再来");
			return;
		}else{
			alert("当前服务器忙，请重试voteControl");
			return;
		}

	});


	/* 确认提交页面重新获取验证码的圆圈按钮 */
	$("#getnewcode").click(function(){
		getCodePic();
	});
}

function getCodePic(){
	$.ajax({
		type:"get",
		async:false,
		url:"http://172.16.17.100:8777/captcha",
		dataType:"json",
		success:function(data){
			var pic = 'data:image/png;base64,' + data.captcha.captcha_img;
			$("#picExam").attr("src", pic);
		},
		error: function(){
		    console.log('很抱歉，获取数据出错，请稍候再试！');
		    alert("当前服务器忙，请重试getCodePic");
		}
	});
}

/* 判断当前用户是否已经达到当天投票上限 */
function checkTimes(){
	var usropenid = getParam('openid');
	var currrent = getCurrentDate();
	$.ajax({
		type:"get",
		async:false,
		url:'http://172.16.17.100:8777/examlog/?exam=8&create_gte=' + currrent + '&openid=' + usropenid,
		dataType:"json",
		success:function(data){
			var times = data.results.length;
			if(times < 2){
				return 'enable';
			}else{
				return 'disable';
			}
		},
		error: function(){
		    console.log('很抱歉，获取用户当日参加活动次数出错，请稍候再试！');
		    alert("当前服务器忙，请重试checkTimes");
		}
	});
}




/* 获取url参数 */
function getParam(paramName) {
    paramValue = "", isFound = !1;
    if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
        arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&"), i = 0;
        while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
    }
    return paramValue == "" && (paramValue = null), paramValue
}


/* 获取当前日期 */
function getCurrentDate(){
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

/* 判断是否登记了个人信息，若没有，则弹出框要求用户提交个人信息 */
function checkSigned(){
	var usropenid = getParam('openid');
	$.ajax({
		type:"get",
		async:false,
		url:'http://172.16.17.100:8777/wxusers/?openid=' + usropenid + '&name=&phone=',
		dataType:"json",
		success:function(data){
			var flag = data.count;
			var name = data.results.name;
			var phone = data.results.phone;
			/*首次登陆的需要登记*/
			if(flag === 0){

				/*首次登陆用户不会有已经选择的项目，所以跳转至验证码的提交按钮隐藏，只显示过程中的提交按钮*/
				$("#uploadinfo-in").css('display','inline-block');
				$("#uploadinfo-final").css('display','none');

				$("#getuserinfomodal").modal();
				return;
			/*非首次登陆但是没有登记信息的也需要登记*/
			}else if((flag > 0) && ((name === "") || (phone === ""))){

				/*此处处理方式同上*/
				$("#uploadinfo-in").css('display','inline-block');
				$("#uploadinfo-final").css('display','none');
				
				$("#getuserinfomodal").modal();
				return;
			}else{
				/* 当用户完成个人信息填写就不做弹出的操作了 */
				return 'userSigned';
			}
		},
		error: function(){
		    console.log('很抱歉，获取用户openid出错，请稍候再试！');
		    alert("当前服务器忙，请重试checkSigned");
		}
	});
}


function signIn(){
	var usropenid = getParam('openid');
	var name = $("#username").val();
	var phone = $("#userphone").val();
	if((name === "") || (phone === "")){
		alert("请填写完整");
		return;
	}
	$.ajax({
		type:"post",
		async:false,
		url:'http://172.16.17.100:8777/wxusers/?openid=' + usropenid + '&name=' + name + '&phone=' + phone,
		dataType:"json",
		success:function(data){
			return "success signed";
		},
		error: function(){
		    console.log('很抱歉，提交用户信息错误，请稍候再试！');
		    alert("当前服务器忙，请重试signIn");
		}
	});

}


function UploadInfo(){
	$("#uploadinfo-in").click(function(){
		var flsg = signIn();
		if(flag === 'success signed'){
			$('#getuserinfomodal').modal('hide');
		}else{
			alert("信息提交失败，请重试UploadInfo");
			return;
		}
	})
}

function UploadInfoAndConfrimVote(){
	$("#uploadinfo-final").click(function(){
		var flsg = signIn();
		if(flag === 'success signed'){
			$('#getuserinfomodal').modal('hide');
			
			/*唤醒带验证码的提交页面*/
			getCodePic();
			$('#votemodal').modal();
		}else{
			alert("信息提交失败，请重试UploadInfoAndConfrimVote");
			return;
		}
	})
}