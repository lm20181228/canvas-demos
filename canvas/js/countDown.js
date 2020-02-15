var window_width = 1024;
var window_height = 768;
var MARGI_TOP = 60;
var MARGI_LEFT = 30;
var space = 10;
var r = 4;
//设计倒计时初始时间
//var endTime = new Date(2020,0,15,18,05,00);
//设计倒计时时间，需要修改成固定的用上面的那种，注意月份比当前月份小1
var endTime = new Date();
//设置倒计截至时间为当前时间的12小时之后，时间灵活了
endTime.setHours(endTime.getHours() + 12);


var curShowTimeSeconds = 0;
var balls = [];
var context="";
const colors = ["#33b5e5","##0099cc","#aa66cc","#9933cc","#99cc00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]
window.onload = function(){
	var canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	canvas.width = window_width;
	canvas.height = window_height;
	var setTime = null;
	curShowTimeSeconds = getTime();
	setTime = setInterval(function(){
		render(context,getTime());
		update();
	},50)
}
//获取时间
function getTime(){
	var curTime = new Date();
	var duration = endTime.getTime() - curTime.getTime();
	var ret = parseInt(duration/1000);
	return ret>=0?ret : 0;
}
//更新画布数据
function update(){
	var nextShowTimeSeconds = getTime();

	var nextHours = parseInt(nextShowTimeSeconds/3600);
	var nextMintues = parseInt((nextShowTimeSeconds-nextHours*3600)/60);
	var nextSeconds = nextShowTimeSeconds%60;

	var curHours = parseInt(curShowTimeSeconds/3600);
	var curMintues = parseInt((curShowTimeSeconds-curHours*3600)/60);
	var curSeconds = curShowTimeSeconds%60;
	
	if(nextSeconds != curSeconds){
		if(parseInt(nextHours/10) != parseInt(curHours/10)){
			addBalls(MARGI_LEFT,MARGI_TOP,parseInt(curHours/10));
		}
		if(parseInt(nextHours%10) != parseInt(curHours%10)){
			addBalls(MARGI_LEFT+8*space,MARGI_TOP,parseInt(curHours%10));
		}
		if(parseInt(nextMintues/10) != parseInt(curMintues/10)){
			addBalls(MARGI_LEFT+21*space,MARGI_TOP,parseInt(curMintues/10));
		}
		if(parseInt(nextMintues%10) != parseInt(curMintues%10)){
			addBalls(MARGI_LEFT+29*space,MARGI_TOP,parseInt(curMintues%10));
		}
		if(parseInt(nextSeconds/10) != parseInt(curSeconds/10)){
			addBalls(MARGI_LEFT+42*space,MARGI_TOP,parseInt(curSeconds/10));
		}
		if(parseInt(nextSeconds%10) != parseInt(curSeconds%10)){
			addBalls(MARGI_LEFT+50*space,MARGI_TOP,parseInt(curSeconds%10));
		}
		curShowTimeSeconds = nextShowTimeSeconds;
	}
	updateBalls()
}
//添加小球到balls中去
function addBalls(x,y,mun){
	for(var i=0; i<digit[mun].length; i++){
		for(var j=0; j<digit[mun][0].length;j++){
			if(digit[mun][i][j] == 1){
				var ball = {
					x:x+(j*space),
					y:y+(i*space),
					r:6,	
					g:Math.ceil(Math.random()*2),
//					vx:Math.random()*2>1?-Math.ceil(Math.random()*4):Math.ceil(Math.random()*4),
					vx:Math.pow(-1,Math.ceil(Math.random()*2))*(Math.random()*4),//获取-1的奇数幂或者偶数幂，获得-1或者1，决定正负
					vy:Math.pow(-1,Math.ceil(Math.random()*2))*(Math.random()*10),
//					color:"rgb("+Math.ceil(Math.random()*250)+","+Math.ceil(Math.random()*250)+","+Math.ceil(Math.random()*250)+")",
					color:colors[Math.floor(Math.random()*colors.length)]
				}
				balls.push(ball);
			}
		}
	}
}
//添加小球方法
function updateBalls(context){
	for(var i =0; i<balls.length; i++){
		balls[i].x += balls[i].vx ;
		balls[i].y += balls[i].vy ;
		balls[i].vy += balls[i].g ;
		if(balls[i].y>window_height-balls[i].r){
			balls[i].y = window_height-balls[i].r;
			balls[i].vy = -balls[i].vy *0.8;
		}
	}
	//优化页面小球数量，优化性能
	var cnt = 0;
	for(var i =0 ; i<balls.length;i++){
		if((balls[i].x - balls[i].r) >0 && (balls[i].x + balls[i].r)<window_width){
			balls[cnt] =balls[i]; 
			cnt++;
		}
	}
	while(balls.length > cnt){
		balls.pop();
	}
}
function render(context){
	//刷新
	context.clearRect(0,0,window_width,window_height);
	var hour = parseInt(curShowTimeSeconds/3600);
	var mintue = parseInt((curShowTimeSeconds-hour*3600)/60);
	var second = curShowTimeSeconds%60;
	
	var x = MARGI_LEFT;
	var y = MARGI_TOP;
	//显示小时
	digitArc(x,y,parseInt(hour/10),space,r,context);
	digitArc(x+8*space,y,(hour%10),space,r,context);
	
	digitArc(x+16*space,y,10,space,r,context);
	//显示分钟
	digitArc(x+21*space,y,parseInt(mintue/10),space,r,context);
	digitArc(x+29*space,y,mintue%10,space,r,context);
	
	digitArc(x+37*space,y,10,space,r,context);
	//显示秒数
	digitArc(x+42*space,y,parseInt(second/10),space,r,context);
	digitArc(x+50*space,y,second%10,space,r,context);
	//绘制彩色小点
	for(var i =0; i<balls.length; i++){
		context.beginPath();
		context.arc(balls[i].x,balls[i].y,balls[i].r,0,2*Math.PI);
		context.fillStyle = balls[i].color;
		context.fill();
		context.closePath();
	}
}
//绘制时间点
function digitArc(x,y,mun,space,r,context){
	for(var i=0; i<digit[mun].length; i++){
		for(var j=0; j<digit[mun][0].length;j++){
			if(digit[mun][i][j] == 1){
				context.beginPath();
				context.arc(x+(j*space),y+(i*space),r,0,2*Math.PI);
				context.fillStyle = "#000";
				context.fill();
				/*context.stroke();*/
				context.closePath();
			}
		}
	}
}
