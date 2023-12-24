let input_x_valid=()=>/^(-3|-[0-2]([\.\,]\d+)?|[0-4]([\.\,]\d+)?|5)$/.test(mine_x.value)||(/^[+-]?(\d*\.)?\d+[eE][+-]?\d+$/.test(mine_x.value)&&-3<=parseFloat(mine_x.value)&&parseFloat(mine_x.value)<=5);
let input_y_valid=()=>Array.from(document.getElementsByName('y')).map(x=>x.checked).reduce((x,y)=>x||y);
let input_r_valid=()=>!!select_r.value;

let blink_data = {timer_id:0, elements: [], counter:0, run:()=>blink_data.timer_id||=setInterval(blink_data.blink,300), blink:()=>{
	if (blink_data.counter++>5)
		clearInterval(blink_data.timer_id), blink_data.timer_id=0, blink_data.counter=0, blink_data.elements=[];
	else
		Array.from(blink_data.elements).map(x=>{
			x.style.outline=blink_data.counter%2?'2px solid red':'';
			x.style.outlineOffset=blink_data.counter%2?'5px':'';
			x.style.transition=blink_data.counter%2?'0s all linear':'';
		});
}};

let blink_x=()=>(blink_data.elements.push(mine_x),blink_data.run());
let blink_y=()=>(Array.from(document.getElementsByName('y')).map(x=>blink_data.elements.push(x)),blink_data.run());
let blink_r=()=>(blink_data.elements.push(blink_r_el),blink_data.run());


let mine_submit=()=>{
	let f=!0;
	!input_x_valid() && (blink_x(),f=!1);
	!input_y_valid() && (blink_y(),f=!1);
	!input_r_valid() && (blink_r(),f=!1);
	return f;
}
var canvas, ctx;
let getCursorPosition=(canvas, event, r)=>{
	const rect = canvas.getBoundingClientRect();
	let x = event.clientX - rect.left;
	let y = event.clientY - rect.top;
	x = x/canvas.clientWidth;
	y = y/canvas.clientHeight;
	x = x * 300;
	y = y * 300;
	var old = [document.getElementById("form:hidden-value-x").value, document.getElementById("form:y").value];
    document.getElementById("form:hidden-value-x").value=Math.floor(r*(x-150)/90*1000)/1000;
    document.getElementById("form:y").value=Math.floor(r*(150-y)/90*1000)/1000;
    document.getElementById("form:play-button").click();
	setTimeout(()=>{
		document.getElementById("form:hidden-value-x").value = old[0];
		document.getElementById("form:y").value = old[1];
	},50);
}
let render=()=>{
	if (!img) return;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(img, 0, 0);
	if (!getR()) return;
	
	let count = document.getElementById("form:count").value

    for (let i=0;i<count;i++){
        let varX = document.getElementById("tablePoint:"+i.toString()+":td_x").innerText.trim();
        let varY = document.getElementById("tablePoint:"+i.toString()+":td_y").innerText.trim();
        let color = document.getElementById("tablePoint:"+i.toString()+":td_hit").innerText==="HIT" ? "#FF0" : "#F00";
        let varR = document.getElementById("tablePoint:"+i.toString()+":td_r").innerText.trim();
        
		if (varR==+getR()){
			ctx.fillStyle=color;
            ctx.beginPath();
			ctx.arc(varX*90/varR+150, -varY*90/varR+150, 5, 0, 2 * Math.PI);
			ctx.fill();
        }
    }
}
var img;
let onld=()=>{
	canvas = document.getElementById("tir");
	canvas.addEventListener('mouseup', function(e) {
		if (getR())
			getCursorPosition(canvas, e, +getR())
		else
			blink_r()
	})
	ctx = canvas.getContext("2d");
	img = new Image();
	img.onload = function () {
		render();
	};
	img.src = "tir.png";
	setX();
	
}

function setX(){
    let select = document.getElementById('form:x').options;


    for (let i = 0; i < select.length; i++) {
        if (select[i].selected) {
            document.getElementById("form:hidden-value-x").value=select[i].value;
        }
    }
}

function setR(radius){
    document.querySelectorAll(".point-button").forEach(x=>x.style.filter="");
    document.getElementById("form:r-"+(radius+'').replace(".","_")).style.filter="brightness(1.5)";
    document.getElementById("form:hidden-value-r").value=radius;
	render();
}

function getR() {
    return (Array.from(document.querySelectorAll(".point-button")).filter(x=>x.style.filter!=="")[0]||{}).value;
}