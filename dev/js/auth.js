$(() => {
  let flag = true;

  $('.switch-ref').on('click', (e) => {
    e.preventDefault();

    $('p.error').remove();
    $('input').removeClass('error');
    $('input').val('');

    if (flag) {
      flag = false;

      $('.register').show('slow');
      $('.login').hide('slow');
    } else {
      flag = true;
      $('.login').show('slow');
      $('.register').hide('slow');
    }
  });

  $('input').on('focus', () => {
    $('p.error').remove();
    $('input').removeClass('error');
  });

  $('.login-button').on('click', (e) => {
    e.preventDefault();

    $('p.error').remove();
    $('input').removeClass('error');

    const data = {
      email: $('#log-email').val(),
      password: $('#log-password').val()
    };

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/auth/login'
    }).done((res) => {
      if (!res.ok) {
        $('.login h1').after(`<p class="error">${res.error}</p>`);
        if (res.fields) {
          res.fields.forEach((item) => {
            $(`input[name=${item}]`).addClass('error');
          });
        }
      } else {
        $(window.location).attr('href', '/');
        // $(window.location).attr('href', `/students/${req.session.userId}`);
      }
    });
  });
});
