$(function () {
    $('.datepicker').bootstrapMaterialDatePicker({
        format: 'DD-MM-YYYY',
        clearButton: true,
        weekStart: 1,
        time: false
    });
    $('#student_photo').change(function (e) {
        var file = e.target.file[0];
        var formData = new FormData();
        formData.append('student_photo', file);
    });
    $('#aadhar_photo').change(function (e) {
        var file = e.target.file[0];
        var formData = new FormData();
        formData.append('aadhar_photo', file);
    });
    $('#college_photo').change(function (e) {
        var file = e.target.file[0];
        var formData = new FormData();
        formData.append('college_photo', file);
    });
});