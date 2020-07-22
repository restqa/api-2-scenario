$('#result').hide()

$('#example').click(() => {
  let cmdExample = `curl -X GET "https://mock.trueid.net/customer/subscription/v2/accounts/01234/subscription?offer_code=EPL_RC_12M&offer_code=EPL_RC_6M&status=active&status=future_active&active=true&order=desc&page=1&limit=20" -H "accept: application/json"`
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
