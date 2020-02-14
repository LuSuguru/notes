const createSingleIframe = getSingle(function () {
  var iframe = document.createElement('iframe')
  document.body.appendChild(iframe)

  return iframe
})

document.getElementById('loginBtn').onclick = () => {
  const loginLayer = createSingleIframe()
  loginLayer.src = 'http://baidu.com'
}