$(() => {
  $('#accordion').accordion({ collapsible: true });

  const data = {
    id: '',
    subject: '',
    value: '',
    comment: ''
  };

  function getMarksInfo(subjectId, markId) {
    const page = window.location.href.split('/')[window.location.href.split('/').length - 1];
    console.log(page);
    $.ajax({
      type: 'POST',
      data: JSON.stringify({ page }),
      contentType: 'application/json',
      url: '/marks/get'
    }).done((res) => {
      for (let i = 0; i < res.data.studentProfile.semesters.length; i += 1) {
        for (let j = 0; j < res.data.studentProfile.semesters[i].subjects.length; j += 1) {
          // eslint-disable-next-line no-underscore-dangle
          if (res.data.studentProfile.semesters[i].subjects[j]._id === subjectId) {
            for (
              let k = 0;
              k < res.data.studentProfile.semesters[i].subjects[j].marks.length;
              k += 1
            ) {
              // eslint-disable-next-line no-underscore-dangle
              if (res.data.studentProfile.semesters[i].subjects[j].marks[k]._id === markId) {
                $('#mark-select').val(
                  res.data.studentProfile.semesters[i].subjects[j].marks[k].value
                );
                $('#comment').val(
                  res.data.studentProfile.semesters[i].subjects[j].marks[k].comments
                );
                break;
              }
            }
            break;
          }
        }
      }
    });
  }

  $(document).tooltip({
    //   position: {
    //     me: 'right top',
    //     at: 'right+5 top-19'
    //     // using(position, feedback) {
    //     //   $(this).css(position);
    //     //   $('<div>')
    //     //     .addClass('arrow')
    //     //     .addClass('right')
    //     //     .appendTo(this);
    //     // }
    //   }
  });

  $('select').on('change', () => {
    $('p.error').remove();
    $('input').removeClass('error');
    $('select').removeClass('error');
    $('.dialog').css('height', '181');
  });

  function checkMark() {
    $('p.error').remove();
    $('#mark-select').removeClass('error');
    $('.dialog').css('height', '181');
    if ($('#mark-select').val() === '') {
      $('.dialog').css('height', '250');
      $('fieldset').before('<p class="error"> Выберите оценку </p>');
      $('#mark-select').addClass('error');
      return false;
    }
    return true;
  }

  function onClose() {
    $('p.error').remove();
    $('input').removeClass('error');
    $('select').removeClass('error');
    $('.dialog').css('height', '181');
    $('#mark-select').val('');
    $('#comment').val('');
  }

  function addMark(info) {
    $.ajax({
      type: 'POST',
      data: JSON.stringify(info),
      contentType: 'application/json',
      url: '/marks/update'
    }).done((res) => {
      console.log(res);
      if (res.ok) {
        if (res.type === 'update') {
          console.log('updating');
          $(`.${data.id}`).html(data.value);
          $(`.${data.id}`).prop('title', `Дата: ${Date(Date.now())}. Комментарии: ${data.comment}`);
          $(`.${data.id}`).removeClass(
            $(`.${data.id}`)
              .attr('class')
              .split(' ')
              .pop()
          );
          $(`.${data.id}`).addClass(`mark${data.value}`);
        } else {
          console.log('adding');
          $(`#new${data.subject}`).before(
            `<button class="mark- ${res.newId} ${data.subject} mark${data.value}" name=mark-${
              res.newId
            } class=mark${data.value} id=${res.newId} title="Дата:${Date(
              Date.now()
            )}. Комментарии:${data.comment}">${data.value}</button>`
          );
        }
      }
    });
  }

  const dialog = $('.dialog').dialog({
    autoOpen: false,
    dialogClass: 'dialog-title',
    height: 300,
    width: 350,
    modal: true,
    buttons: {
      Ok() {
        data.value = $('#mark-select').val();
        data.comment = $('#comment').val();
        if (checkMark()) {
          addMark(data);
          onClose();
          dialog.dialog('close');
        }
      },
      Cancel() {
        onClose();
        dialog.dialog('close');
      }
    },
    close() {
      onClose();
      dialog.dialog('close');
    }
  });

  $('button[name^="mark-"]').on('click', function buttonClick() {
    const classes = $(this)
      .attr('class')
      .split(' ');
    /* eslint-disable prefer-destructuring */
    data.id = classes[1];
    data.subject = classes[2];
    /* eslint-enable prefer-destructuring */
    getMarksInfo(classes[2], classes[1]);
    dialog.dialog('open');
  });
});
