const username = localStorage.getItem("username")
document.getElementById('usernameWelcome').innerText = username
document.getElementsByTagName('title').innerText = 'users - ' + username

function checkAddForm(){
    const addMessage = document.getElementById('addMessage')
    const addMessageGuid = document.getElementById('addMessageGuid')
    const addButton = document.getElementById('addButton')
    const workDate = document.getElementById('workDate')
    const workDateGuid = document.getElementById('workDateGuid')

    if (addMessage.value == '' || workDate.value == ''){
       if(addMessage.value == ''){
           addMessageGuid.innerText = "please write a title for your work !!!"
           addMessageGuid.classList.add('text-danger')
           addButton.setAttribute('disabled','')
       } else if (addMessage.value != ''){
           addMessageGuid.innerText = ''
           addMessageGuid.classList.remove('text-danger')
       }
       if(workDate.value == ''){
           workDateGuid.innerText = 'please inter your works date !!!'
           workDateGuid.classList.add('text-danger')
           addButton.setAttribute('disabled','')
       } else if (workDate.value != '') {
           workDateGuid.innerText = ''
           workDateGuid.classList.remove('text-danger')
       }
    } else {
       addButton.removeAttribute('disabled')
       addMessageGuid.innerText = ''
       addMessageGuid.classList.remove('text-danger')
       workDateGuid.innerText = ''
       workDateGuid.classList.remove('text-danger')
    }
}

/* --- */

async function sendAddJSON() {
    const addMessage = document.getElementById('addMessage')
    const workDate = document.getElementById('workDate')
    const myJson = {
        "message": addMessage.value,
        "good" : 1,
        "data" : workDate.value,
        "name" : username
    }
    /* --- */
    try {
        const response = await fetch('http://127.0.0.1:8000/user/notation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(myJson)
        });
        if (response.ok) {
            response.json().then(result => {
                const addTitle = document.getElementById("addTitle");
                if (result.mes == 'null'){
                    addTitle.innerText = "your work, added successfuly !!!";
                    addTitle.classList.remove("text-danger");
                    addTitle.classList.add("text-success");
                    addMessage.value = null;
                    addGoodOrBad.value = null;
                    workDate.value = null;
                } else {
                    addTitle.innerText = "there is something wrong with your data !!!";
                    addTitle.classList.remove("text-success");
                    addTitle.classList.add("text-danger");
                    addMessage.value = null;
                    addGoodOrBad.value = null;
                    workDate.value = null;
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

// --------------------------------------- // ------------------

function checkSeeForm (){
    const seeButton = document.getElementById('seeButton')
    const startDate = document.getElementById('startDate')
    const endDate = document.getElementById('endDate')
    const seeDateGuid = document.getElementById('seeDateGuid')

    // اگر تاریخ شروع و پایان خالی بود یا برای کار خوب یا بد مقادیر بالای یک و پایین منفی یک وارد کرد ، جلوی زدن دکمه را بگیر
    if ((startDate.value == '' || endDate.value == '')) {
        if (startDate.value == '' || endDate.value == '') {
            seeDateGuid.innerText = 'please inter your start and end date !!!'
            seeDateGuid.classList.add('text-danger')
            seeButton.setAttribute('disabled','')
        } else {
            seeDateGuid.innerText = ''
            seeDateGuid.classList.remove('text-danger')
        }

    } else {
        seeDateGuid.innerText = ''
        seeDateGuid.classList.remove('text-danger')
        seeButton.removeAttribute('disabled')
    }
}

/* --- */

async function sendSeeJSON() {
    const seeMessage = document.getElementById('seeMessage')
    const startDate = document.getElementById('startDate')
    const endDate = document.getElementById('endDate')
    const myJson = {
        "message": seeMessage.value,
        "name": username,
        "good": 1,
        "start": startDate.value,
        "end": endDate.value
    }
    /* --- */
    try {
        const response = await fetch('http://127.0.0.1:8000/user/report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(myJson)
        });
        if (response.ok) {
            response.json().then(result => {
                // console.log(result)
                const seeTitle = document.getElementById("seeTitle");
                const showResultsTitle = document.getElementById('showResultsTitle');
                if (result.length == 0){
                    seeTitle.innerText = 'There is no work between two date !!!'
                    showResultsTitle.innerText = 'NO DATA !!! between ' + startDate.value + ' and ' + endDate.value
                    seeTitle.classList.remove('text-success')
                    seeTitle.classList.add('text-danger')
                    showResultsTitle.classList.remove('text-success')
                    showResultsTitle.classList.add('text-danger')
                    seeMessage.value = null;
                    seeGoodOrBad.value = null;
                    startDate.value = null;
                    endDate.value = null;
                } else {
                    // نتایج قبلی را پاک می کنیم
                    clearResults()
                    // پیام موفقیت و دادن اطلاعات زمانی بازه کار ها
                    seeTitle.innerText = 'success !!!'
                    seeTitle.classList.remove('text-danger')
                    seeTitle.classList.add('text-success')
                    showResultsTitle.classList.remove('text-danger')
                    showResultsTitle.classList.add('text-success')
                    showResultsTitle.innerText = 'your works between ' + startDate.value + ' and ' + endDate.value + ' are :'
                    // به ازای جی سون هر کار که در آرایه بر می گردد ، دیویژنی ساخته و در تگی که برای نشان دادن کار ها تدارک دیده ایم ، وارد می نماید
                    for (let index = 0; index < result.length; index++) {
                        const element = result[index];
                        /* کد ایجاد  */
                        const mainDiv = document.createElement('div') // دیویژن کلی که کلاس ریسپانسیو دارد
                        mainDiv.classList.add('col-xs-12','col-md-6','col-lg-4','text-center', 'p-2', 'border')
                        const dataDiv = document.createElement('div') // دیوی که اطلاعات در آن است

                        const workMessage = document.createElement('p')
                        workMessage.classList.add('h4');
                        workMessage.innerText = element.message;
                        const workDate = document.createElement('p')
                        workDate.innerText = element.data
                        if (element.good == 1) {
                            dataDiv.classList.add('bg-success' , 'py-3' ,'border' , 'rounded' )
                        } else if (element.good == 0) {
                            dataDiv.classList.add('bg-danger' , 'py-3' ,'border' , 'rounded')
                        }
                        // --- انتصاب تک ها به هم یا اپند کردن
                        dataDiv.appendChild(workMessage);
                        dataDiv.appendChild(workDate);
                        mainDiv.appendChild(dataDiv)
                        document.getElementById('showResults').appendChild(mainDiv)
                        
                    }
                    // خالی کردن ورودی ها برای دیدن مقادیر بعدی
                    seeMessage.value = null;
                    seeGoodOrBad.value = null;
                    startDate.value = null;
                    endDate.value = null;
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

// پاک کردن لیست کار ها و اطلاعات داخلشان
function clearResults () {
    const showResultsTitle = document.getElementById('showResultsTitle');
    showResultsTitle.innerText = ''
    const showResults = document.getElementById('showResults')
    showResults.innerHTML = null;
}