

async function seeAllUsers (){
    try {
        const response = await fetch('http://127.0.0.1:8000/manager/GetAllUsers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            response.json().then(result => {
                // console.log(result.length)
                if (result.length > 0) {
                    clearSeeUsers()
                    for (let index = 0; index < result.length; index++) {
                        const element = result[index];
                        // ---- ایجاد تگ های نیاز
                        const mainDiv = document.createElement('div')
                        mainDiv.classList.add('col-xs-6','col-md-4','col-lg-3','p-4','bg-secondary','text-light','border','rounded')

                        const userUserName = document.createElement('p')
                        userUserName.classList.add('h4')
                        userUserName.innerText = element.name

                        const userPassword = document.createElement('p')
                        userPassword.innerText = element.password
                        // ---- داخل هم انداختن
                        mainDiv.appendChild(userUserName);
                        mainDiv.appendChild(userPassword);

                        document.getElementById('showResultSec').appendChild(mainDiv)
                    }
                } else {
                    
                }
                
            })
        } else {
            const data = await response.json();
            alert(`Error: ${data.detail}`);
        }
    } catch (error) {
        console.error('Error registering user:', error);
    }
}


function clearSeeUsers () {
    document.getElementById('showResultSec').innerHTML = null;
}

// ##################################################################


// یوزر نیم رو وارد کرده باشه
function checkManagerUserName () {
    const userName = document.getElementById('userName');
    const userNameGuid = document.getElementById('userNameGuid');
    const managerButton = document.getElementById('managerButton');
    
    if (userName.value == '') {
        userNameGuid.innerText = 'please inter a valid userName !!!'
        userNameGuid.classList.add('text-danger')
        managerButton.setAttribute('disabled','')
    } else {
        userNameGuid.innerText = ''
        userNameGuid.classList.remove('text-danger')
        checkManagerForm()
    }
}

// تاریخ اول و آخر رو داده باشه
function checkManagerDate () {
    const managerButton = document.getElementById('managerButton');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const dateGuid = document.getElementById('dateGuid');

    if (startDate.value == '' & endDate.value == '') {
        dateGuid.innerHTML = 'please inter a valid date for start and end of time !!!';
        dateGuid.classList.add('text-danger')
        managerButton.setAttribute('disabled','')
    } else {
        dateGuid.innerHTML = '';
        dateGuid.classList.remove('text-danger')
        checkManagerForm()
    }
}

// مشکلی نبود بذار بزنه رو دکمه
function checkManagerForm () {
    const managerButton = document.getElementById('managerButton');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');    
    const userName = document.getElementById('userName');
    if ((startDate.value != '' || endDate.value != '') & userName.value != '' ) {
        managerButton.removeAttribute('disabled')
    }
}

// -- ارتباط با ای پی ای

async function manager () {
    const userName = document.getElementById('userName').value
    const message = document.getElementById('message').value
    let good;
    good = -1;
    let dateS,dateE,start,end,isSee
    if (document.getElementById('isSee').checked){
        dateS = '1000-01-01';
        dateE = '9000-01-01';
        isSee = true;
        if (document.getElementById('startDate').value == '') {
            start = '1900-01-01'
            end = document.getElementById('endDate').value
        } else if (document.getElementById('endDate').value == '') {
            start = document.getElementById('startDate').value
            end = '2050-01-01'
        } else {
            start = document.getElementById('startDate').value
            end = document.getElementById('endDate').value
        }
        
    } else if (document.getElementById('isDelete').checked) {
        start = '1000-01-01';
        end = '9000-01-01';
        isSee = false;
        if (document.getElementById('startDate').value == '') {
            dateS = '1900-01-01'
            dateE = document.getElementById('endDate').value
        } else if (document.getElementById('endDate').value == '') {
            dateS = document.getElementById('startDate').value
            dateE = '2050-01-01'
        } else {
            dateS = document.getElementById('startDate').value
            dateE = document.getElementById('endDate').value
        }
    }
    const myJson = {
        "username": userName,
        "dateS": dateS,
        "dateE": dateE,
        "good": good,
        "start": start,
        "end": end,
        "message": message
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/manager', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(myJson)
        });
        if (response.ok) {
            response.json().then(result => {
                let seeDeleteTitle = document.getElementById('seeDeleteTitle')
                clearSeeUsers()
                // اگر دیدنی بود
                if (isSee) {
                    if (result.length == 0) {
                        seeDeleteTitle.innerText = userName + ' doesn\'t exist or have no informathin in the specified time frame !'
                        seeDeleteTitle.classList.remove('text-success' , 'text-success')
                        seeDeleteTitle.classList.add('text-danger')
                    } else {
                        seeDeleteTitle.innerText = userName + '\' information found successfully !!!'
                        seeDeleteTitle.classList.remove('text-success' , 'text-danger')
                        seeDeleteTitle.classList.add('text-info')
                        for (let index = 0; index < result.length; index++) {
                            const element = result[index];
                            // ---- ایجاد تگ های نیاز
                            const mainDiv = document.createElement('div')
                            mainDiv.classList.add('col-xs-6','col-md-4','col-lg-3','p-4','text-light','border','rounded' ,'text-center')

                            const userUserName = document.createElement('p')
                            userUserName.classList.add('h4')
                            userUserName.innerText = element.name

                            const workTitle= document.createElement('p')
                            workTitle.innerText = element.message

                            const workDate = document.createElement('p')
                            workDate.innerText = element.data
                            // ---- داخل هم انداختن
                            mainDiv.appendChild(userUserName);
                            mainDiv.appendChild(workTitle);
                            mainDiv.appendChild(workDate)

                            if (element.good == 1) {
                                mainDiv.classList.add('bg-success')
                            } else if (element.good == 0) {
                                mainDiv.classList.add('bg-danger')
                            }
                            document.getElementById('showResultSec').appendChild(mainDiv)

                        }    
                    }
                    
                } else {
                   seeDeleteTitle.innerText = "if user " + userName + ' exist (!), works are deleted between 2 time !!!'
                   seeDeleteTitle.classList.add('text-success')
                   seeDeleteTitle.classList.remove('text-danger')
                }
                
            })

            // alert('User registered successfully!');
            // window.location.href = '/login/'; // Redirect to login page
        } else {
            const data = await response.json();
            alert(`Error: ${data.detail}`);
        }
    } catch (error) {
        console.error('Error registering user:', error);
        alert('Error registering user:' + error)
    }
    
}
