//第一步，获取页面元素
var box = document.getElementById("box");
var ul = box.children[0];
var lis = ul.children;

//为每个li添加背景图片
for(var i=0;i<lis.length;i++){
    lis[i].style.backgroundImage="url(./image/"+( i + 1 )+ ".jpg)" ;
    lis[i].onmouseover = function(){
        for(var i=0;i<lis.length;i++){
            animate(lis[i],{ "width" : 100 });
        }
        animate(this , {"width" : 800});
    };
}
    box.onmouseout=function(){
        for(var j=0;j<lis.length;j++){
            animate(lis[j],{"width":240});
        }
    }

    
//动画特效
function animate(obj,json){
    clearInterval(obj.timer);
    obj.timer=setInterval(function(){
        var flag=true;
        for(k in json){
            var leader=parseInt(getStyle(obj,k)) || 0;
            var target=json[k];
            var steps=(target-leader)/10;
            steps= steps>0 ?Math.ceil(steps):Math.floor(steps);
            leader=leader+steps;
            obj.style[k]=leader+"px";// obj.style.width=leader+"px";
            if(leader === target){
                clearInterval(obj.timer);
            }
            if (leader != target) {

                flag = false;//告诉标记 当前这个属性还没到达

            }
        }
        if (flag) {
            clearInterval(obj.timer);
        }
    },15);
}
function getStyle(obj , attr){
    if(window.getComputedStyle){
        return window.getComputedStyle(obj,null)[attr];
    }else{
        return obj.currentStyle[attr];
    }
}