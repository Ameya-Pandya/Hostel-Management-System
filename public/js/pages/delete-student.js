$(function () {
    //Delete Button
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
            url: '/get-student-details',
            data: formData,
            success: function (data) {
                // console.log(data);
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

    $('#userTable').DataTable({
        dom: 'Bfrtip',
        responsive: true,
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    });
});