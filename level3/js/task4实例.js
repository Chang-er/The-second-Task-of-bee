/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/
// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();    //返回表示当前年份的四位数字
  var m = dat.getMonth() + 1;   //getMonth（）返回0-11的数来表示当前月份
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();         //返回月份中的某一天，1-31之间的数
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = '';
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);   //得到与每天相对应的随机空气质量指数数据
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};
// 用于渲染图表的数据
var chartData = {};
// 记录当前页面的表单选项
var pageState= {
  nowSelectCity: "北京",
  nowGraTime: "day",
  width:20
}
var aqiChartWrap=document.getElementById("aqi-chart-wrap"),
    formGraTime=document.getElementById("form-gra-time"),
    citySelect=document.getElementById("city-select");
/*
渲染图表
 */
function renderChart() {
  var content=" ";
  for(var item in chartData){
    var bg="#" + Math.random().toString(16).substring(2, 8);   //得到背景的随机颜色
    content+='<div class="div"style="height:'+chartData[item]+'px;width:'+pageState.width+'px;background-color:'+bg+';"'+'title="'+item+'  空气质量指数：'+chartData[item]+'">'+
   '</div>';
   }
   aqiChartWrap.innerHTML=content;
}
/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  formGraTime.addEventListener("click",graTimeChange);
}
/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化
  var input=document.getElementsByTagName("input");
  for(var i=0;i<input.length;i++){
    if(input[i].checked){     //确定选中的粒度
      pageState.nowGraTime=input[i].value;  // 设置对应数据
    }
  }
  initAqiChartData();   // 调用图表渲染函数
}
/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var content=" ";
    for(var city in aqiSourceData ){
        content+='<option value="'+city+'" >'+city+'</option>';
    }
     citySelect.innerHTML=content;
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
     citySelect.addEventListener("change",citySelectChange);
}
/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  var options=document.getElementsByTagName("option");
  for(var i=0;i<options.length;i++){
    if(options[i].selected){      // 确定被选中的城市
      pageState.nowSelectCity=options[i].value;   // 设置对应数据
    }
  }
  initAqiChartData();     // 调用原始数据处理函数
}
/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
　//将选中城市的数据先放在chart中
  var chart=aqiSourceData[pageState.nowSelectCity];
  switch(pageState.nowGraTime){     //根据选择的粒度计算数据并保存至chartData
    case "day":{
      chartData={};
      chartData=chart;
      pageState.width=10;       //设置每个显示出来的柱子的宽度
      break;
    }
    case "week":{
      chartData={};
      var sum=0,i=0,week=0;
      for(var item in chart){
        sum+=chart[item];
        i++;
        if(new Date(item).getDay()==6) {
          week++;
          chartData['2016年第'+week+'周']=Math.round(sum/i);
          sum=0;i=0;
        }
     }
      if(sum!=0){
         week++;
         chartData['2016年第'+week+'周']=Math.round(sum/i);
      }
      pageState.width=100;
      break;
    }
    case "month":{
      chartData={};
      var sum=0,i=0,month=0;
      for(var item in chart){
        if((new Date(item)).getMonth()==month) {
          sum+=chart[item];
          i++;
        }
        else{
          month++;
          chartData['2016年'+month+'月']=Math.round(sum/i);
          sum=0;i=0;
          sum+=chart[item];
          i++;
        }
      }
      if(sum!=0){
        month++;
        chartData['2016年'+month+'月']=Math.round(sum/i);
      }
      pageState.width=300;
      break;
    }
  }
  renderChart();       //调用图表渲染函数
}
// 初始化函数
 function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
  renderChart();
}
init();