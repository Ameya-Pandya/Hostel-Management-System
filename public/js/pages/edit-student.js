$(function () {
    //Edit Button
    var rowData = [];
    var deleteData = [];
    var updateData = {};

    // ======================================================================================
    // Get Student Details
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
            contactNo: rowData[4],
            studentId: rowData[7],
        };
        console.log(formData);
        let status = false;
        // console.log(formData);
        //sending the ajax request
        $.ajax({
            type: 'POST',
            url: '/edit-student/get-student-details',
            data: formData,
            success: function (data) {
                var studentDetails = data.student_details;
                // console.log(studentDetails);
                if (data.success == true) {
                    // showNotification('bg-green', data.msg, 'top', 'center', 'animated bounceInDown', 'animated bounceOutDown');
                    status = true;
                    //Showing the Modal
                    $('#editStudentModal').modal();
                    $('input').each(function (index, element) {
                        // console.log(studentDetails);
                        // var name = ;
                        // console.log(studentDetails[element.name]);
                        $(element).val(studentDetails[element.name]);

                    });
                    $('textarea').each(function (index, field) {
                        $(field).val(studentDetails[field.name]);
                    });
                    // console.log(studentDetails.rent_duration);
                    // console.log($('select[name="payment_duration"]').val());
                    $('select[name="payment_duration"]').val(studentDetails.rent_duration).change();
                } else {
                    showNotification('bg-red', data.msg, 'top', 'center', 'animated bounceInDown', 'animated bounceOutDown');
                    status = false;
                }
            },
            error: function (error) {
                console.log(error);
                showNotification('bg-red', error, 'top', 'center', 'animated bounceInDown', 'animated bounceOutDown');
                status = false;
            }
        });
        return status;
    });

    // ======================================================================================

    $('input').change(function (e) {
        var name = this.name;
        updateData[name] = this.value;
        // console.log(updateData);
    })

    $('textarea').change(function (e) {
        var name = this.name;
        updateData[name] = this.value;
    });

    // Updating the data
    $('#editForm').submit(function (evt) {
        evt.preventDefault();
        updateData.student_id = $('input[name="student_id"').val();
        updateData._csrf = $('input[name="_csrf"').val();
        let status = false;
        $.ajax({
            type: 'POST',
            url: '/edit-student/update-student',
            data: updateData,
            success: function (data) {
                if (data.success == true) {
                    $('#editStudentModal').modal('toggle');
                    showNotification('bg-green', data.msg, 'top', 'center', 'animated bounceInDown', 'animated bounceOutDown');
                    status = true;
                    location.reload();
                } else {
                    $('#editStudentModal').modal('toggle');
                    showNotification('bg-red', data.msg, 'top', 'center', 'animated bounceInDown', 'animated bounceOutDown');
                    status = false;
                }
            },
            error: function (error) {
                $('#editStudentModal').modal('toggle');
                showNotification('bg-red', error, 'top', 'center', 'animated bounceInDown', 'animated bounceOutDown');
                console.log(error);
                status = false;
            }
        })
        return status;
    });

    // ======================================================================================

    // Delete Ajax
    $('#delete_button').on('click', function (evt) {
        // console.log(this.parentNode.parentNode);
        $(this.parentNode.parentNode).find('td').each(function () {
            var cellText = $(this).html();
            // console.log(cellText);
            deleteData.push(cellText);
        });
        let formData = {
            roomNo: deleteData[1],
            studentName: deleteData[2],
            collegeName: deleteData[3],
            contactNo: deleteData[4],
            studentId: deleteData[7],
        };
        let status = false;

        $.ajax({
            type: 'POST',
            url: '/edit-student/delete-student',
            data: formData,
            success: function (data) {
                if (data.success == true) {
                    showNotification('bg-green', data.msg, 'top', 'center', 'animated bounceInDown', 'animated bounceOutDown');
                    status = true;
                    location.reload();
                } else {
                    showNotification('bg-red', data.msg, 'top', 'center', 'animated bounceInDown', 'animated bounceOutDown');
                    status = false;
                }
            },
            error: function (error) {
                $('#editStudentModal').modal('toggle');
                showNotification('bg-red', error, 'top', 'center', 'animated bounceInDown', 'animated bounceOutDown');
                console.log(error);
                status = false;
            }
        })
        return status;
    });

    // ======================================================================================
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
        responsive: true
    });
});