$(function () {
    $('.datepicker').bootstrapMaterialDatePicker({
        format: 'DD-MM-YYYY',
        clearButton: true,
        weekStart: 1,
        time: false
    });
    var objData = new FormData();
    $('#student_photo').change(function (e) {
        // console.log(e.target.files[0]);
        var file = e.target.files[0];
        objData.append('student_photo', file);
    });
    $('#aadhar_photo').change(function (e) {
        var file = e.target.files[0];
        objData.append('aadhar_photo', file);
    });
    $('#college_photo').change(function (e) {
        var file = e.target.files[0];
        objData.append('college_photo', file);
    });
});