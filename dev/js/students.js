$(() => {
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
      console.log(res);
      $('.table-body-td').remove();
      $('th').css('width', '1000px');
      $('.table-head-th-0').css('width', '8px');
      // $('.table-head-th-0').css('width', '8px');
      // $('.table-head-th-4').css('width', '1000px');
      /* eslint-disable no-underscore-dangle */
      Object.entries(res.data)
        .reverse()
        .forEach((item) => {
          console.log(item[1].id);
          $('.table-body').after(
            `<tr class="table-body-td"><th>${item[0]}</th><td><a href="/students/${
              item[1]._id
            }">${`${item[1].studentProfile.surname} ${item[1].studentProfile.name} ${item[1].studentProfile.patronymic}`}</a></td><td>${
              item[1].studentProfile.fakult
            }</td><td>${item[1].studentProfile.course}</td><td>${
              item[1].studentProfile.spec
            }</td></tr>`
            /* eslint-enable no-underscore-dangle */
          );
        });
    });
  });
});
