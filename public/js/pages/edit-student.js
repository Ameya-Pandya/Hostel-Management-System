$(function () {
    //Edit Button
    var rowData = [];
    $('#edit_button').on('click', function (evt) {
        // console.log(this.parentNode.parentNode);
        $(this.parentNode.parentNode).find('td').each(function () {
            var cellText = $(this).html();
            // console.log(cellText);
            rowData.push(cellText);
        });
        let formData = {
            roomNo: rowData[1],
            studentName: rowData[2],
            collegeName: rowData[3],
            branchName: rowData[4],
            studentId: rowData[6],
        };
        let status = false;
        // console.log(formData);
        //sending the ajax request
        $.ajax({
            type: 'POST',
            url: '/edit-student/get-student-details',
            data: formData,
            success: function (data) {
                if (data.success == true) {
                    showNotification('bg-green', data.msg, 'top', 'center', 'animated bounceInDown', 'animated bounceOutDown');
                    status = true;
                } else {
                    showNotification('bg-red', data.msg, 'top', 'center', 'animated bounceInDown', 'animated bounceOutDown');
                    status = false;
                }
            },
            error: function (error) {
                showNotification('bg-red', data.msg, 'top', 'center', 'animated bounceInDown', 'animated bounceOutDown');
                status = false;
            }
        });
        return status;
    });


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
    $('#userTable').DataTable({
        dom: 'Bfrtip',
        responsive: true,
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    });
});