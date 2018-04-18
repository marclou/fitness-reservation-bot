// Add specific CSS class (bold & underline) to the selected <a> link on header
$("header > p > a[href*='" + location.pathname.split('/')[1] + '/' + location.pathname.split('/')[2] + "']").addClass('currentTab');

// Used for back-navigaation
function goBack() {
    window.history.back();
}

$('#remove').on('click', function (e) {
    // Disgusting.. to be modified
    var redirectURL = '/dashboard/' + window.location.pathname.split('/')[2];

    e.preventDefault();
    if (confirm('Are you sure? It will be deleted permanently.')) {
        $.ajax({
            url: window.location.pathname + 'delete',
            type: 'POST',
            success: function (res) {
                window.location.href = redirectURL;
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

$('#gym-add').on('submit', function () {
    var values = {};
    var data = {};
    $.each($(this).serializeArray(), function () {
        values[this.name] = this.value;
    });

    data = {
        name: values['gym_name'],
		address: {
            value: values['gym_address_value'],
            coordinates: {
                longitude: values['gym_address_longitude'],
                latitude: values['gym_address_latitude'],
            },
        },
        maxAttendance: values['gym_maxAttendance'],
        facilities: {
            shower: values['gym_facilities_shower'],
            dressRoom: values['gym_facilities_dressroom'],
        },
    };

    $('#gym-add-payload [name="data"]').val(JSON.stringify(data));
    $('#gym-add-payload').submit();
    return false;
});
