/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var empDBName = "SCHOOL-DB";
var empRelationName = "STUDENT-TABLE3";
var connToken = "90931534|-31949330746119861|90960380";
$("#roll").focus();

function saveRecNo2LS(jsonObj)
{
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getEmpIdAsJsonObj() {
    var roll = $('#roll').val();
    var jsonStr = {
        rollNo: roll
    };
    return JSON.stringify(jsonStr);
}


function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#studname").val(record.name);
    $("#studclass").val(record.class);
    $("#studBd").val(record.birthDay);
    $("#studAdd").val(record.address);
    $("#studEr").val(record.erDay);
}


function resetForm() {

    $('#roll').val("");

    $('#studname').val("");

    $('#studclass').val("");

    $('#studBd').val("");

    $('#studAdd').val("");

    $('#studEr').val("");

    $('#roll').prop("disabled", false);

    $('#save').prop("disabled", true);

    $('#change').prop("disabled", true);

    $('#reset').prop("disabled", true);

    $('#roll').focus();

}

function saveData() {

    var jsonStrObj = validateData();
    if (jsonStrObj === '') {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, empDBName, empRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $('#roll').focus();
}

function changeData() {

    $("#change").prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, empDBName, empRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $('#roll').focus();

}

function validateData() {

    var roll, studname, studclass, studBd, studAdd, studEr;
    roll = $("#roll").val();
    studname = $("#studname").val();
    studclass = $("#studclass").val();
    studBd = $("#studBd").val();
    studAdd = $("#studAdd").val();
    studEr = $("#studEr").val();
    if (roll === '') {
        alert("Student Roll Number is missing");
        $("#roll").focus();
        return "";
    }
    if (studname === '') {
        alert("Student Name missing");
        $("#studname").focus();
        return "";
    }
    if (studclass === '') {
        alert("Student Class missing");
        $("#studclass").focus();
        return "";
    }
    if (studBd === "") {
        alert("Birth Date missing");
        $("#studBd").focus();
        return "";
    }
    if (studAdd === "") {
        alert("Address missing");
        $("#studAdd").focus();
        return "";
    }
    if (studEr === '')
    {
        alert("'Enrollement date missing");
        $("#studEr").focus();
        return "";
    }
    var jsonStrObj = {
        rollNo: roll,
        name: studname,
        class: studclass,
        birthDay: studBd,
        address: studAdd,
        erDay: studEr
    };
    return JSON.stringify(jsonStrObj);

}

function getEmp() {

    var empIdJsonObj = getEmpIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, empDBName, empRelationName, empIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});

    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop('disabled', false);
        $("#studname").focus();
    } else if (resJsonObj.status === 200) {
        $("#roll").prop('disabled', true);
        fillData(resJsonObj);
        $("#change").prop("disabled", false);
        $("#reset").prop('disabled', false);
        $("#studname").focus();
    }

}
