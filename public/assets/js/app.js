$('#result').hide()

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
    success: (data) => {
      $('#result').show()
      $('#scenario').text(data)
      $.get('/ready.gif', d => {
        $('#funGif').attr('src', d)
      })
    }
  })
})


$('#copy').click(() => {
  const el = document.createElement('textarea');
  el.value = $('#scenario').text()
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
})
