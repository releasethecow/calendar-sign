/**
 * QB
 * simple sign calendar
 */
var calUtil = {
  // default year
  showYear:2016,
  // default month
  showMonth:1,
  // default day
  showDays:1,
  eventName:"load",
  // dom ID
  calendarId: "",
  // sign list data: Array of {signDate: "xxx"}
  signList: [],
  // disable pre button
  disablePrev: false,
  // disable next button
  disableNext: false,
  // init calendar
  init:function(json){
    if (json) {
      var id = json.id;
      var signList = json.signList;
      var disableNext = json.disableNext;
      var disablePrev = json.disablePrev;

      if (id) calUtil.calendarId = id;
      if (signList) calUtil.signList = signList;
      if (disableNext === true || disableNext === false) calUtil.disableNext = disableNext;
      if (disablePrev === true || disablePrev === false) calUtil.disablePrev = disablePrev;
    }
    // return when no id
    if (calUtil.calendarId == undefined) {
      console.error('[init] id is required');
      return;
    }
    calUtil.setMonthAndDay();
    calUtil.draw(calUtil.signList);
    calUtil.bindEnvent();
  },
  // render calendar
  draw:function(signList){
    // calendar body
    calUtil.signList=signList || [];
    var str = calUtil.drawCal(calUtil.showYear,calUtil.showMonth,signList);
    $("#"+calUtil.calendarId).html(str);
    // calendar header
    var calendarName=calUtil.showYear+"年"+calUtil.showMonth+"月";
    $(".calendar_month_span").html(calendarName);
  },
  // bind event
  bindEnvent:function(){
    //pre month
    $(".calendar_month_prev").click(function(){
      // xxx: you could get data by ajax
      var signList=calUtil.signList;
      calUtil.eventName="prev";
      calUtil.init();
    });
    // nex month
    $(".calendar_month_next").click(function(){
      // xxx: you could get data by ajax
      var signList=calUtil.signList;
      calUtil.eventName="next";
      calUtil.init();
    });
  },
  // set current date
  setMonthAndDay:function(){
    switch(calUtil.eventName)
    {
      case "load":
        var current = new Date();
        calUtil.showYear=current.getFullYear();
        calUtil.showMonth=current.getMonth() + 1;
        break;
      case "prev":
        if (calUtil.disablePrev) {
          return;
        }
        var nowMonth=$(".calendar_month_span").html().split("年")[1].split("月")[0];
        calUtil.showMonth=parseInt(nowMonth)-1;
        if(calUtil.showMonth==0)
        {
          calUtil.showMonth=12;
          calUtil.showYear-=1;
        }
        break;
      case "next":
        if (calUtil.disableNext) {
          return;
        }
        var nowMonth=$(".calendar_month_span").html().split("年")[1].split("月")[0];
        calUtil.showMonth=parseInt(nowMonth)+1;
        if(calUtil.showMonth==13)
        {
          calUtil.showMonth=1;
          calUtil.showYear+=1;
        }
        break;
    }
  },
  // return day in month
  getDaysInmonth : function(iMonth, iYear){
    var dPrevDate = new Date(iYear, iMonth, 0);
    return dPrevDate.getDate();
  },
  bulidCal : function(iYear, iMonth) {
    var aMonth = new Array();
    aMonth[0] = new Array(7);
    aMonth[1] = new Array(7);
    aMonth[2] = new Array(7);
    aMonth[3] = new Array(7);
    aMonth[4] = new Array(7);
    aMonth[5] = new Array(7);
    aMonth[6] = new Array(7);
    var dCalDate = new Date(iYear, iMonth - 1, 1);
    var iDayOfFirst = dCalDate.getDay();
    var iDaysInMonth = calUtil.getDaysInmonth(iMonth, iYear);
    var iVarDate = 1;
    var d, w;
    aMonth[0][0] = "日";
    aMonth[0][1] = "一";
    aMonth[0][2] = "二";
    aMonth[0][3] = "三";
    aMonth[0][4] = "四";
    aMonth[0][5] = "五";
    aMonth[0][6] = "六";
    for (d = iDayOfFirst; d < 7; d++) {
      aMonth[1][d] = iVarDate;
      iVarDate++;
    }
    for (w = 2; w < 7; w++) {
      for (d = 0; d < 7; d++) {
        if (iVarDate <= iDaysInMonth) {
          aMonth[w][d] = iVarDate;
          iVarDate++;
        }
      }
    }
    return aMonth;
  },
  // if is today
  ifToday : function(day, month, year){
    return this.ifSigned([{signDate: new Date()}], day, month, year);
  },
  // if is signed
  ifSigned : function(signList, day, month, year){
    var signed = false;
    $.each(signList,function(index,item){
      if (item.signDate) {
        var sDate=item.signDate;
        if (typeof sDate==="number" || typeof sDate==="string") {
          try{
            sDate=new Date(sDate);
          }catch(e){
            console.log("fmt Date error", e);
          }
        }
        var y=sDate.getFullYear();
        var m=sDate.getMonth() + 1;
        var d=sDate.getDate();
        if (y == year && m == month && d == day) {
          signed = true;
          return false;
        }
      }else if(item.signDay == day) {
        signed = true;
        return false;
      }
    });
    return signed;
  },
  // draw calendar
  drawCal : function(iYear, iMonth ,signList) {
    var myMonth = calUtil.bulidCal(iYear, iMonth);
    var classPrev = calUtil.disablePrev?'calendar_month_prev disable':'calendar_month_prev';
    var classNext = calUtil.disableNext?'calendar_month_next disable':'calendar_month_next';
    var htmls = new Array();
    htmls.push("<div class='sign_main' id='sign_layer'>");
    htmls.push("<div class='sign_succ_calendar_title'>");
    htmls.push("<div class='"+classNext+"'>下月</div>");
    htmls.push("<div class='"+classPrev+"'>上月</div>");
    htmls.push("<div class='calendar_month_span'></div>");
    htmls.push("</div>");
    htmls.push("<div class='sign' id='sign_cal'>");
    htmls.push("<table>");
    htmls.push("<tr>");
    htmls.push("<th>" + myMonth[0][0] + "</th>");
    htmls.push("<th>" + myMonth[0][1] + "</th>");
    htmls.push("<th>" + myMonth[0][2] + "</th>");
    htmls.push("<th>" + myMonth[0][3] + "</th>");
    htmls.push("<th>" + myMonth[0][4] + "</th>");
    htmls.push("<th>" + myMonth[0][5] + "</th>");
    htmls.push("<th>" + myMonth[0][6] + "</th>");
    htmls.push("</tr>");
    var d, w;
    var empty = " ";
    for (w = 1; w < 7; w++) {
      htmls.push("<tr>");
      for (d = 0; d < 7; d++) {
        var ifSigned = calUtil.ifSigned(signList, myMonth[w][d], iMonth, iYear);
        var ifToday = calUtil.ifToday(myMonth[w][d], iMonth, iYear);
        var cell = (!isNaN(myMonth[w][d]) ? myMonth[w][d] : empty);
        var tdClass = "";
        if(cell != empty) {
          tdClass+="number ";
        }
        if(ifToday) {
          tdClass+="today ";
        }
        if(ifSigned){
          tdClass+="on ";
        } else {
          //
        }
        htmls.push("<td class='"+tdClass+"'>" + cell + "<span class='bg'></span></td>");
      }
      htmls.push("</tr>");
    }
    htmls.push("</table>");
    htmls.push("</div>");
    htmls.push("</div>");
    return htmls.join('');
  },
  // set disable pre button
  setdisablePrev: function (flag) {
    calUtil.disablePrev = flag;
    if (flag){
      $(".calendar_month_prev").removeClass('disable')
    } else {
      $(".calendar_month_prev").addClass('disable')
    }
  },
  // set disable next button
  setdisablePrev: function (flag) {
    calUtil.disableNext = flag;
    if (flag){
      $(".calendar_month_next").removeClass('disable')
    } else {
      $(".calendar_month_next").addClass('disable')
    }
  }
};
