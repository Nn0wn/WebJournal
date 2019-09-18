$(() => {
  $('#fakult').on('change', function changeSpec() {
    const selectVal = $(this).val();
    console.log(selectVal);
    $.ajax({
      type: 'POST',
      data: JSON.stringify({ val: selectVal }),
      contentType: 'application/json',
      url: '/administration/get/spec'
    }).done((res) => {
      console.log(res);
      const select = $('#spec');
      let options = [];
      if (select.prop) {
        options = select.prop('options');
      } else {
        options = select.attr('options');
      }
      $('option', select).remove();

      options[0] = new Option('Не выбрано', '');
      for (let i = 0; i < res.specs.length; i += 1) {
        options[i + 1] = new Option(res.specs[i], res.specs[i]);
      }
    });
  });

  $('.search-button').on('click', (e) => {
    e.preventDefault();

    const data = {
      fio: $('#fio').val(),
      fakult: $('#fakult').val(),
      course: $('#course').val(),
      spec: $('#spec').val()
    };

    console.log(data);

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/search/students'
    }).done((res) => {
      // console.log(res);
      $('.table-body-td').remove();
      $('th').css('width', '1000px');
      $('.table-head-th-0').css('width', '8px');
      // $('.table-head-th-0').css('width', '8px');
      // $('.table-head-th-4').css('width', '1000px');
      /* eslint-disable no-underscore-dangle */
      Object.entries(res.data)
        .reverse()
        .forEach((item) => {
          // console.log(item[1].id);
          if (item[1].studentProfile && item[1].studentProfile._id) {
            $('.table-body').after(
              `<tr class="table-body-td"><th>${parseInt(item[0], 10)
                + parseInt(1, 10)}</th><td><a href="/students/${
                item[1]._id
              }">${`${item[1].surname} ${item[1].name} ${item[1].patronymic}`}</a></td><td>${
                item[1].studentProfile.fakult
              }</td><td>${item[1].studentProfile.course}</td><td>${
                item[1].studentProfile.spec
              }</td></tr>`
              /* eslint-enable no-underscore-dangle */
            );
          }
        });
    });
  });
});
