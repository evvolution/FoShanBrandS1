/*
	note : 19年品牌佛山活动
	author : zx
	date : 2019-6-3
*/

$(document).ready(function(){
	setScrollheight();
	get_S1_list1();
	get_S1_list2();
	stateControl();
	nochange();
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
		url:"http://172.16.17.100:8777/exam/get_vote/?exam_id=9&openid=123123",
		dataType:"json",
		success:function(data){
			var listcontent = "";
			for (var i=0; i<data.projects[0].length; i++){
				var head = '<li class="list-group-item">';
				var order = '<span class="list-order"><strong>' + (i+1) + '</strong></span>';
				var name = '<span class="list-co">' + data.projects[0][i].title + '</span>';
				var pic = '<span class="list-pic"><img class="list-pic-in" src="' + data.projects[0][i].pic_url + '" /></span>';
				var checkbox = '<input onclick=stateControl("s1-list1-checkbox","s1-list1-num","s1-list1-state") type="checkbox" name="s1-list1-checkbox" class="fspCheckBox" value="' + data.projects[0][i].item_id + '"/ >';
				var tail = '</li>';

				listcontent += (head + order + name + pic + checkbox + tail);
			}
			$("#s1-list1-list").html(listcontent);
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
		url:"http://172.16.17.100:8777/exam/get_vote/?exam_id=8&openid=123123",
		dataType:"json",
		success:function(data){
			var listcontent = "";
			for (var i=0; i<data.projects[0].length; i++){
				var head = '<li class="list-group-item">';
				var order = '<span class="list-order"><strong>' + (i+1) + '</strong></span>';
				var name = '<span class="list-co">' + data.projects[0][i].title + '</span>';
				var pic = '<span class="list-pic"><img class="list-pic-in" src="' + data.projects[0][i].pic_url + '" /></span>';
				var checkbox = '<input onclick=stateControl("s1-list2-checkbox","s1-list2-num","s1-list2-state") type="checkbox" name="s1-list2-checkbox" class="fspCheckBox" value="' + data.projects[0][i].item_id + '"/ >';
				var tail = '</li>';

				listcontent += (head + order + name + pic + checkbox + tail);
			}
			$("#s1-list2-list").html(listcontent);
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
		$('#' + num).html('<span style="color:yellow">已达上限</span>');
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


function nochange(){
	var btn1 = document.getElementById("uploadinfo");
	var btn2 = document.getElementById("cancelinfo");
	var btn3 = document.getElementById("getinfo");
    // 触摸
    btn1.onclick = function() {
        this.style.backgroundColor = "transparent";
        this.style.outline = "none";
        this.style.color = "#188ae2";
    };
    btn2.onclick = function() {
        this.style.backgroundColor = "transparent";
        this.style.outline = "none";
        this.style.color = "#fff";
    };
    btn3.onclick = function() {
        this.style.backgroundColor = "transparent";
        this.style.outline = "none";
        this.style.color = "#188ae2";
    };
}