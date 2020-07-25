function reset() {
  $('#copied').hide()
  $('#result').hide()
  $('#result #loader').show()
  $('#result #success').hide()
  $('#result #fail').hide()
  $('#gif').hide()
  $('#gif h3').text('')
  $('#gif src').attr('src', '')
}

$('#example').click(() => {
  let cmdExample = `curl https://sv443.net/jokeapi/v2/joke/Any`
  $('#inputArea').val(cmdExample)
  $('#btn')[0].click()
})

$('#btn').click(() => {
  let data = $('#inputArea').val()
  if (!data) return


  jQuery.ajax({
    type: "POST",
    url: '/curl',
    data: {
      cmd: data
    },
    beforeSend: () => {
      reset()
      $('#result').show()
    },
    success: (data) => {
      $('#result #success').show()
      $('#scenario').text(data)
      $.get('/ready.gif', d => {
        $('#gif').show()
        $('#gif h3').text('Ready ?')
        $('#gif img').attr('src', d)
      })
    },
    error: (err) => {
      $('#result #fail').show()
      $('#fail pre').text(err.responseText)
      $.get('/error.gif', d => {
        $('#gif').show()
        $('#gif h3').text('Oups...')
        $('#gif img').attr('src', d)
      })
    },
    complete: () => {
      $('#result #loader').hide()
    }
  })
})


$('.copy').click(() => {
  const el = document.createElement('textarea');
  el.value = $('#scenario').text()
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  $('#copied').show()
  setTimeout(() => {
    $('#copied').hide()
  }, 2000)
})

reset()
