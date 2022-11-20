
 
 const api= "http://localhost:3000/";

async function auth() {
   

    let formData = getFormData()
    let passLogin = md5(formData.password)
    console.log(formData.username)
    console.log(passLogin)
    let authorization = formData.username + ":" + passLogin
    
    let base64 = btoa(authorization)
    
    let headers = new Headers({
        authorization: "Basic " + base64
    })
    
    let fetchOptions= {
        headers: headers,
        method: 'GET',
        cache: 'no-cache'
    }

    let url = api + 'auth'
    console.log(url)
    const response = await fetch(url, fetchOptions);
    const usuario = await response.json();
    console.log('oi2')
    
  console.log(usuario)
  
    if (usuario == null) {
        alert('Usuario não encontrado!')
    } else {
        setLogado(usuario)
        window.location.href = "../menu/menu.html"
    }
   
}

function setLogado(usuario) {
    localStorage.setItem('logado', JSON.stringify(usuario));
    return true;
}

function getLogado() {
    return JSON.parse(localStorage.getItem('logado'));
}

async function verify() {
    let logado = getLogado();
    console.log(logado);


    if (logado == null) {
        return;
    }

    let authorization = logado.email + ":" + logado.password
    let base64 = btoa(authorization)

    console.log(authorization)
    console.log(base64)


    let headers = new Headers({
        authorization: "Basic " + base64
    })

    let options= {
        headers: headers,
        method: 'GET',
        cache: 'no-cache'
    }

    let url = api + 'verify'
    const response = await fetch(url, options);
    const usuario = await response.json();

    console.log(usuario)

    if (usuario) {
        window.location.href = "../menu/menu.html"
    } else {
        alert('Senha ou usuário inválidos')
    }
}

async function out() {
    localStorage.removeItem('logado');
}

function getFormData() {
    let form= document.querySelector('form');
    let formData = new FormData(form)
    let dados = Object.fromEntries(formData)
    return dados
}
verify()
               








