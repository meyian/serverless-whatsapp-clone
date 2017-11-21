/*

Vanilla Bootstrap

*/

$(function(){

  // variables
  var intEnterKey = 13;
  var intNotTooSlow = 600;
  var boolTestMode = false;
  var boolJustSubmitted = false;

  var intNumTries, intMaxNumTries = 10;
  var intInterval = -1;
  var intRefreshRate = 200;

  var strDb = "sandbox";
  var strCollection = "collection";
  var strVistorCollection = "visits";
  var strApiKey = "AFBb-xyx6hdMxNIK3V0il153RnhfZ1U6";
  var strQueryAllDataUrl = `https://api.mlab.com/api/1/databases/${strDb}/collections/${strCollection}?apiKey=${strApiKey}`;
  var strQueryAllDataSortedUrl = strQueryAllDataUrl + `&s={"timestamp": -1}`;
  var strSaveDataUrl = `https://api.mlab.com/api/1/databases/${strDb}/collections/${strCollection}/?apiKey=${strApiKey}`;

  var strGetVisitDataUrl = `https://api.mlab.com/api/1/databases/${strDb}/collections/${strVistorCollection}?apiKey=${strApiKey}`;
  var strSaveVisitDataUrl = `https://api.mlab.com/api/1/databases/${strDb}/collections/${strVistorCollection}/?apiKey=${strApiKey}`;


  var arrCurrentContent = [];



  // classes







  // functions

  function msg(strErrMsg){
    console.log(strErrMsg);
    // $(".div-msg-area").html(strErrMsg);
  }

  function dummyPrintCallback(arrData){
    console.log("dummyPrintCallback > line 35 | arrData: ", arrData);
  }


  function clearList(){
    $("#ul-storage-items").html('');
  }



  function loadSavedContent(){



    var objThis = this;
    var arrData = [];


    const fnIsDoingOver = (() => {
      arrData = boolTestMode ? getDummyData() : getDataFromMLab(); // : getDataFromMLab();

      var boolIsSameData = (JSON.stringify(arrCurrentContent) == JSON.stringify(arrData));
      var boolIsTooMany = (intNumTries >= intMaxNumTries);
      var boolIsDoingOver = boolIsSameData && !boolIsTooMany;

      console.log(`fnIsDoingOver > boolIsSameData, boolIsTooMany, boolIsDoingOver = (${boolIsSameData}, ${boolIsTooMany}, ${boolIsDoingOver})`);

      return boolIsDoingOver;

    }).bind(objThis);

    const fnInterval = (() => {
      arrData = boolTestMode ? getDummyData() : getDataFromMLab();
      var boolIsSameData = (JSON.stringify(arrCurrentContent) == JSON.stringify(arrData));
      var boolIsTooMany = (intNumTries >= intMaxNumTries);

      while (true){

        if (!fnIsDoingOver()){

          arrCurrentContent = arrData;

          clearList();
          clearInterval(intInterval);

          console.log("loadSavedContent > line 45 | arrData: ", arrData);

          for (var i in arrData){
            var strItem = arrData[i];
            var jLi = $("<li>").html(strItem);
            $("#ul-storage-items").append(jLi);
          }

          break;
        }
        else{
          intNumTries++;
        }
      }
    }).bind(objThis);

    intInterval = setInterval(fnInterval, intRefreshRate);
  }

  function getDummyData(){
    var arrRetData = [
      'January', "February", "March", "April",
      "May", "June", "July", "August", "September",
      "October", "November", "December"
    ];

    return arrRetData;
  }

  function getDataFromMLab(strRestUrl){

    var strGetUrl = strRestUrl || strQueryAllDataSortedUrl;
    console.log("getDataFromMLab > strGetUrl: ", strGetUrl);
    // fnDoneCallback = fnDoneCallback || dummyPrintCallback;

    var retData = $.ajax(
      {
        url: strGetUrl,
  		  // data: JSON.stringify(objData),
  		  type: "GET",
  		  contentType: "application/json",
        async: false
    })
      .done((data) => {
        console.log("saveDataToMLab > done: ", data);

        // var arrRetData = [];
        //
        // for (var i in data){
        //   var objDatum = data[i];
        //   var strData = objDatum.data;
        //
        //   arrRetData.push(strData);
        // }
        //
        //
        // return arrRetData;
        // fnDoneCallback(arrRetData);


      })
      .fail((data) => {
        console.log("saveDataToMLab > fail: ", data);
      });

      console.log();
      var arrRespData = retData.responseJSON;

      var arrRetData = [];

      for (var i in arrRespData){
        var objDatum = arrRespData[i];
        var strData = objDatum.data;

        arrRetData.push(strData);
      }


      return arrRetData;

      // return a;
  }

  function saveDataToMLab(objData, strRestUrl){

    console.log("saveDataToMLab > line 69. | alpha");

    var strPutUrl = strRestUrl || strSaveDataUrl;

    $.ajax(
      {
        url: strPutUrl,
  		  data: JSON.stringify(objData),
  		  type: "POST",
  		  contentType: "application/json"
    })
      .done((data) => {
        console.log("saveDataToMLab > done: ", data);
      })
      .fail((data) => {
        console.log("saveDataToMLab > fail: ", data);
      });
  }

  function clearTextbox(){
    $("#input-list").val('');
  }

  function saveData(strText){

    var intTimestamp = Math.floor((+ new Date()) / 1000);
    var objData = {
      data: strText,
      timestamp: intTimestamp
    };

    saveDataToMLab(objData);
  }

  function showMsg(strNewText, objNewMsgStyle){

    var strOldText = $("#h2-press-enter").html();
    var objNewMsgStyle = objNewMsgStyle || {};

    $("#h2-press-enter")
      .stop()
      .fadeOut(intNotTooSlow, () => {

        $("#h2-press-enter")
          .html(strNewText)
          .css(objNewMsgStyle)
          .fadeIn(intNotTooSlow, () => {

            $("#h2-press-enter")
              .delay( 800 )

              .fadeOut(intNotTooSlow, () => {

                $("#h2-press-enter")
                  .html(strOldText)
                  .css("font-size", "")
                  .fadeIn(intNotTooSlow);

              });
          })
      })
  }

  function showErrorMsg(){

    var strNewText = "Please Enter Text First";
    var objNewMsgStyle = {"font-size" : "2vw"};

    showMsg(strNewText, objNewMsgStyle);
  }

  function submitPage(){

    console.log("submitPage");

    var strTextContent = $("#input-list").val();

    if (strTextContent){

      console.log("foo");

      saveData(strTextContent);
      clearTextbox();
      // $("#h2-press-enter").blur
      showMsg("Saved!");
      loadSavedContent();

      boolJustSubmitted = true;
    }
    else if (boolJustSubmitted){
      boolJustSubmitted = false;
    }
    else if (!boolJustSubmitted){
      boolJustSubmitted = false;
      console.log("bar");

      showErrorMsg();
    }


  }

  function inputListKeyPressHandler(evt){

    // evt.preventDefault();

    var strTextContent = $("#input-list").val();
    var intPressedKeyCode = evt.which;

    console.log(evt);

    msg(`intPressedKeyCode: ${intPressedKeyCode}`)

    if (intPressedKeyCode == intEnterKey){
      submitPage();
    }

    // return false;
  }

  function fadeInBySelector(strSelector){
    $(strSelector).stop().removeClass("dont-show").fadeOut(0).fadeIn("slow");
  }

  function fadeOutBySelector(strSelector){
    $(strSelector).stop().fadeOut("slow").addClass("dont-show");
  }

  function showIcon(){

    // $("#img-icon").removeClass("dont-show");

    $("#img-icon").stop().removeClass("dont-show").fadeOut(0).fadeIn("fast");
  }

  function hideIcon(){
    // $("#img-icon").addClass("dont-show");
    $("#img-icon").stop().fadeOut("fast").addClass("dont-show");
  }

  function inputListFocusHandler(evt){
    showIcon();
    fadeInBySelector("#div-wait-holder");
  }

  function inputListBlurHandler(evt){
    hideIcon();
    fadeOutBySelector("#div-wait-holder");
  }

  function formSubmitHandler(evt){

    if (!boolJustSubmitted){
      submitPage();
    }



    evt.preventDefault();
    return false;
  }

  function iconClickHandler(evt){
    submitPage();

    // setTimeout(() => {$("#input-list").focus()}, 100);
    // $("#input-list").focus();
  }


  function initHandlers(){
    var objThis = this;

    $("#img-icon").click(iconClickHandler.bind(objThis));

    $("#form").submit(formSubmitHandler.bind(objThis));

    $("#input-list")
      .focus(inputListFocusHandler.bind(objThis))
      .blur(inputListBlurHandler.bind(objThis))
      .keypress(inputListKeyPressHandler.bind(objThis));

  }

  function setupModes() {
    if (!boolTestMode){
      $(".div-msg-area").css("display", "none");
    }

  }

  function setIsMobile(){
    var isMobile = false; //initiate as false

    // device detection
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

    return isMobile;
  }

  function getVistorCount(){
    var arrMlabData = getDataFromMLab(strGetVisitDataUrl);

    console.log("getVistorCount > line 390 | arrMlabData: ", arrMlabData);

    var intNumVisitors = arrMlabData[arrMlabData.length - 1];
    return intNumVisitors;
  }

  function saveNumVistors(intNumVisitors){

    // strGetVisitDataUrl
    // strSaveVisitDataUrl

    var objData = {
      data: intNumVisitors
    };

    saveDataToMLab(objData, strSaveVisitDataUrl);
  }

  function addVisitor(){
    var intNumVisitors = getVistorCount();
    var intNewNumVisitors = intNumVisitors + 1;


    saveNumVistors(intNewNumVisitors);

    displayNumVisitors(intNewNumVisitors);
  }

  function displayNumVisitors(intNumVisitors){
    var strCurrentText = $(".div-msg-area h5").html();
    $(".div-msg-area h5").html(`${strCurrentText} ${intNumVisitors} visits so far.`);
  }

  function setupPhone(){
    if (!setIsMobile()){
      $("#img-icon").remove();
    }
  }

  function init(){
    console.log('line 32. init');
    // setupModes();
    setupPhone();
    initHandlers();
    loadSavedContent();
    addVisitor();
  }



  // script

  init();

})
