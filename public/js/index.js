$('#workout-remove').on('click', function (e) {
    e.preventDefault();
    if (confirm('Are you sure? Workout will be deleted permanently.')) {
        $.ajax({
            url: window.location.pathname + '/delete',
            type: 'POST',
            success: function (res) {
                window.location.href = '/dashboard/workout';
                alert('Successfully deleted :)');
            },
            error: function (err, err1, err2) {
                alert(JSON.parse(err.responseText).error);
            },
        });
    }
});

$('#workout-add').on('submit', function () {
    var values = {};
    var data = {};
    $.each($(this).serializeArray(), function () {
        values[this.name] = this.value;
    });

    data = {
        name: values['workout_name'],
		location: values['workout_location'],
        date: values['workout_date'] + ' ' + values['workout_time'],
        duration: values['workout_duration'],
		cost: {
			individual: values['workout_cost_indiv'],
			group: values['workout_cost_group'],
		},
		miscellaneous: {
			en: values['workout_misc_en'],
			kr: values['workout_misc_kr'],
		},
    };

    $('#workout-add-payload [name="data"]').val(JSON.stringify(data));
    $('#workout-add-payload').submit();
    return false;
});
