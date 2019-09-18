$(() => {
  $('#user-status').on('change', () => {
    const status = $('#user-status').val();
    if (status === 'Студент') {
      $('.student-form').css('display', 'block');
      $('.lecturer-form').css('display', 'none');
    } else if (status === 'Преподаватель') {
      $('.student-form').css('display', 'none');
      $('.lecturer-form').css('display', 'block');
    } else {
      $('.student-form').css('display', 'none');
      $('.lecturer-form').css('display', 'none');
    }
  });

  $('input').on('focus', () => {
    $('p.error').remove();
    $('input').removeClass('error');
    $('select').removeClass('error');
  });

  $('select').on('change', () => {
    $('p.error').remove();
    $('input').removeClass('error');
    $('select').removeClass('error');
  });

  $('.confirm-button-1').on('click', (e) => {
    e.preventDefault();
    $('p.error').remove();
    $('input').removeClass('error');
    $('select').removeClass('error');

    let data = {};
    const pubFields = {
      username: '#username',
      usersurname: '#usersurname',
      userpatronymic: '#userpatronymic'
    };
    const isAdmin = $('#roots').is(':checked');
    let flag = true;

    const status = $('#user-status').val();
    if (isAdmin && status === '') {
      Object.entries(pubFields).forEach((item) => {
        if ($(item[1]).val() === '') {
          $(item[1]).addClass('error');
          flag = false;
        }
      });

      if (flag) {
        data = {
          type: 0,
          name: $('#username').val(),
          surname: $('#usersurname').val(),
          patronymic: $('#userpatronymic').val(),
          isAdmin
        };
      } else {
        $('.create-user h1').after('<p class="error"> Заполните выделенные поля </p>');
      }
    } else if (status === 'Студент') {
      const studFields = {
        ...pubFields,
        ...{ fakult: '#fakult', course: '#course', spec: '#spec' }
      };

      Object.entries(studFields).forEach((item) => {
        if ($(item[1]).val() === '') {
          $(item[1]).addClass('error');
          flag = false;
        }
      });

      if (flag) {
        data = {
          type: 1,
          name: $('#username').val(),
          surname: $('#usersurname').val(),
          patronymic: $('#userpatronymic').val(),
          isAdmin,
          fakult: $('#fakult').val(),
          spec: $('#spec').val(),
          course: $('#course').val()
        };
      } else {
        $('.create-user h1').after('<p class="error"> Необъодимо заполнить все поля </p>');
      }
    } else if (status === 'Преподаватель') {
      const prepFields = {
        ...pubFields,
        ...{ department: '#department' }
      };

      Object.entries(prepFields).forEach((item) => {
        if ($(item[1]).val() === '') {
          $(item[1]).addClass('error');
          flag = false;
        }
      });

      if (flag) {
        data = {
          type: 2,
          name: $('#username').val(),
          surname: $('#usersurname').val(),
          patronymic: $('#userpatronymic').val(),
          isAdmin,
          department: $('#department').val()
        };
      } else {
        $('.create-user h1').after('<p class="error"> Необъодимо заполнить все поля </p>');
      }
    } else {
      $('#user-status').addClass('error');
      $('.create-user h1').after('<p class="error"> Выберите статус </p>');
    }

    if (!(Object.keys(data).length === 0 && data.constructor === Object)) {
      $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/administration/newuser'
      }).done((res) => {
        console.log(res);
      });
    }
  });

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

  $('#group-chose').on('change', function changeGroup() {
    const selectVal = $(this).val();
    console.log(selectVal);
    $.ajax({
      type: 'POST',
      data: JSON.stringify({ val: selectVal }),
      contentType: 'application/json',
      url: '/administration/get/group'
    }).done((res) => {
      console.log(res);
      const select = $('#subject-chose');
      let options = [];
      if (select.prop) {
        options = select.prop('options');
      } else {
        options = select.attr('options');
      }
      $('option', select).remove();

      options[0] = new Option('Не выбрано', '');
      for (let i = 0; i < res.subjects.length; i += 1) {
        options[i + 1] = new Option(res.subjects[i].name, res.subjects[i].id);
      }
    });
  });

  $('.confirm-button-2').on('click', (e) => {
    e.preventDefault();
    $('p.error').remove();
    $('select').removeClass('error');

    const errorFields = [];
    if ($('#lecturer-chose').val() === '') {
      errorFields.push('lecturer-chose');
    }
    if ($('#group-chose').val() === '') {
      errorFields.push('group-chose');
    }
    if ($('#subject-chose').val() === '') {
      errorFields.push('subject-chose');
    }
    if (Array.isArray(errorFields) && errorFields.length > 0) {
      $('.add-lecturer h1').after('<p class="error"> Необходимо выбрать все селекторы </p>');
      for (let i = 0; i < errorFields.length; i += 1) {
        $(`#${errorFields[i]}`).addClass('error');
      }
    } else if (Array.isArray(errorFields) && errorFields.length === 0) {
      const data = {
        lecturer: $('#lecturer-chose').val(),
        group: $('#group-chose').val(),
        subject: $('#subject-chose').val()
      };

      console.log(data);

      $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/administration/set/group/lecturer'
      }).done((res) => {
        console.log(res);
      });
    }
  });
});
