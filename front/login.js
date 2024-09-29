rulesIsChecked(document.getElementById('rule'))

function userNameIsOk (e){
    const userNameText = document.getElementById('userNameText')
    if(e.value == ''){
        userNameText.innerText = 'please inter your username !!!'
        userNameText.classList.remove('text-light')
        userNameText.classList.add('text-danger')
    } else {
        userNameText.innerText = ''
        userNameText.classList.remove('text-danger')
    }
}

function passwordIsOk (e){
    const passwordText = document.getElementById('passwordText')
    if(e.value == ''){
        passwordText.innerText = 'please inter your password !!!'
        passwordText.classList.add('text-danger')
    } else {
        passwordText.innerText = ''
        passwordText.classList.remove('text-danger')
    }
}


async function sendJSON() {
    const username = document.getElementById('username').value
    const pass = document.getElementById('pass').value
    const myJson = {
        "name": username,
        "password" : pass
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(myJson)
        });
        if (response.ok) {
            response.json().then(result => {
                // console.log(result)
                if (result.mes == 'fill the blanks'){
                    alert('please fill the form')
                } else if (result.mes == 'This username exist with different password'){

                    alert('این نام کاربری با پسورد دیگری موجود است')

                } else if (result.mes == 'Welcome To Manager Part :) ') {
                    if (myJson.name == 'manager' & myJson.password == '14034') {
                        localStorage.setItem("username" , myJson.name);
                        localStorage.setItem("password" , myJson.password);
                        window.location.href = './manager.html';
                    }
                } else if (result.mes = 'null'){
                    localStorage.setItem("username" , myJson.name);
                    localStorage.setItem("password" , myJson.password);
                    window.location.href = 'users.html';
                }
            })

        } else {
            const data = await response.json();
            alert(`Error: ${data.detail}`);
        }
    } catch (error) {
        console.error('Error registering user:', error);
        alert('Error registering user:' + error)
    }
    
}