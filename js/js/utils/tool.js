
export function timeFormat(seconds){
	if(seconds === undefined){
		return '未知';
	}
	if(typeof seconds!=='number'){
		seconds = parseInt(seconds)
	}
	let sec = seconds%60;
	let min = parseInt(seconds/60);
	let res = '';
	return `${min>=10?min:'0'+min}:${sec>=10?sec:'0'+sec}`;
}

export function offsetLeft(ele){
	let left = ele.offsetLeft;
	let parent = ele.offsetParent;
	while(parent){
		left += parent.offsetLeft;
		parent = parent.offsetParent;
	}
	return left;
}

export function trim(str){
	return str.replace(/(^\s*)|(\s*$)/g,'');
}

export function formatText(str){              //去除文本中html标签
	if(typeof str!=="string"){ 
		return str;
	}
	return str.replace(/<[^>]+>/g,'');
}

function quickSort(arr,l,r){//对歌词进行快排
	if( l < r ){
		let i = l , j = r , z = arr[l];
		while(i < j){
			while(i < j && arr[j][0] > z[0]){
				j--;
			}
			if(i <  j){
				arr[i++] = arr[j];
			}
			while(i < j && arr[i][0] < z[0]){
				i++;
			}
			if(i < j ){
				arr[j--] = arr[i];
			}
		}
		arr[i] = z;
		quickSort(arr,l,i-1);
		quickSort(arr,i+1,r);
	}
	return arr;
}


export function formatLrc(str){
	let arr = str.split('\n'),
		timeRegG = /\[(\d{2}):(\d{2})\.(\d{2})\]/g,//防止歌词出现[00:00.02][00:16.20]xxx 的情况
		timeReg = /\[(\d{2}):(\d{2})\.(\d{2})\]/,//[00:16.20]xxx ，歌词可能有两种形式的表现
		result = [],test,time,text,isSort=false;
	for(let i=0;i<arr.length;i++){
		if(trim(arr[i])!==""){
			var model = arr[i],index=0;
			do{
				test = timeReg.exec(model);
				if(test&&test.length>1){
					time = parseInt(test[1])*60 + parseInt(test[2]);
					text = arr[i].replace(timeRegG,'');
					result.push([time,text]);
					model = model.replace(timeReg,'');
					index++;
					index >= 2 ? isSort = true : '' ;
				}
			}while(test)
		}
	}
	isSort ? quickSort(result,0,result.length-1) : '' ;
	return result;
}

export function solveScrollBug(){ //针对reactjs-scroll插件，删除里面可移动元素，原位置变空白情况
	let arr = document.querySelector('.rc-scroll').style.transform.match(/[-+]?[0-9]+/g),//取translate3D中的第二个px
		nowMove = arr ? arr[2] : 0,
		truethMove = document.querySelector('#wrapper').clientHeight-document.querySelector('#wrapper .rc-scroll').clientHeight;
	if(truethMove > nowMove){ //都是负数，比小,实际translate和当前translate
		let liDom = document.querySelector('#wrapper .listCon li'),
			height = liDom ? liDom.clientHeight : 0,
			y = nowMove-(-height)+1;
		y <= 0 ? '' : y = 0;
		document.querySelector('#wrapper .rc-scroll').style.transform = `translate3d(0px, ${y}px, 0px)`;
		document.querySelector('#wrapper .rc-scroll').style['-webkit-transform'] = `translate3d(0px, ${y}px, 0px)`
	}
}

export function getIndex(arr,time){ //获取正在播放的歌词下标
	var index = arr.length-1 , length = arr.length;
	if(arr[0][0] >= time){//防止time比arr[0][0]小的情况
		return 0
	}
	for(let i = 0 ; i < length-1 ; i++ ){
		if(arr[i][0] <= time && arr[i+1][0] > time){
			index = i;
			break;
		}
	}
	return index;
}

export function filter(arr){ //去重
	let res = [],obj = {} , type = '',length = arr.length;
	for(let i = 0; i < length ; i++){
		type = typeof arr[i].song_id;
		if(!obj[type+arr[i].song_id]){
			obj[type+arr[i].song_id] = 1;
			res.push(arr[i]);
		}
	}
	return res;
}

export function cloneObj(obj){
	var result = {}
	for(var i in obj){
		result[i] = obj[i] instanceof Object ? cloneObj(obj[i]) : obj[i];
	}
	return result;
}

export function deleteItem(arr,song_id,index){
	let length = arr.length,obj = {} ;
	obj.arr = arr.concat();
	obj.index = index;
	for(let i = 0 ; i < length ;i++ ){
		if(obj.arr[i].song_id == song_id){
			obj.arr.splice(i,1);      //从第i个元素开始，删除j个元素，并添加item
			index > i ? obj.index-- : '' ;//被删除的下标在index之前，index-1
			break;
		}
	}
	return obj;
}

export function throttle(method,data,time){ //节流
	clearTimeout(method.id);
	method.id=setTimeout(() => {
		//console.log('节流');
		method.call(window,data);
	},time);
}

export function throttle1(method,data,time,duration = 999999,setTime = 0){ //防抖
	let timer=null, begin=new Date();
	return function(){
		let context=this,current=new Date();
		const d = data;
		clearTimeout(timer);
		if(current - begin >= duration){
			//console.log('咬着牙齿执行一次'
			if(setTime){
				setTimeout(()=>{
					method.call(context,d);
				},setTime)
				begin=current;
			}else {
				method.call(context,d);
				begin=current;
			};
		}else{
			timer=setTimeout(() =>{
				method.call(context,d);
			},time);
		}
	}
}

export function findItem(song_id,arr){
	let length = arr.length;
	for(let i = 0 ; i < length ; i++ ){
		if(arr[i].song_id == song_id){
			return arr[i];
		}
	}
	return null;
}

export function StorageGetter(key){
	var value = localStorage.getItem('ReactMusic_'+key);
	return JSON.parse(value);
}

export function StorageSetter(key,value){
	var json = JSON.stringify(value);
	localStorage.setItem('ReactMusic_'+key,json);
}