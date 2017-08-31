let MyForm = {
    validate: () => { 
        const data = MyForm.getData();
        let errorFields = [];

        if (!validateFio(data.fio)){
            errorFields.push('fio');
        }

        if (!validateEmail(data.email)){
            errorFields.push('email');
        }

        if (!validatePhone(data.phone)){
            errorFields.push('phone');
        }

        return(
            {
                isValid: errorFields.length === 0,
                errorFields: errorFields
            }
        )
    },

    getData: () => {
        const fio = document.getElementById('fio').value,
            phone = document.getElementById('phone').value,
            email = document.getElementById('email').value,
            data = {};

        return {
            fio: fio,
            phone: phone,
            email: email,
        };
    },

    setData: (data) => { 
        const fio = document.getElementById('fio'),
            phone = document.getElementById('phone'),
            email = document.getElementById('email');

        fio.value = data.fio;
        phone.value = data.phone;
        email.value = data.email;
    },

    submit: () => { 
        event.preventDefault();

        const validateData = MyForm.validate(),
            submitButton = document.getElementById('submitButton'),
            data = MyForm.getData();

        removeAllErrorClasses();

        if (validateData.isValid){
            submitButton.disabled = true;
            requestToJsonFile();
        } else {
            setErrorClass(validateData.errorFields);
            MyForm.setData(data)
        }
    }
}

function requestToJsonFile(){
    const xhr = new XMLHttpRequest();

    xhr.open('GET', document.getElementById('myForm').action, false);
    xhr.send();

    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            let data = JSON.parse(xhr.responseText);

            if (data.status === 'success') {
                resultContainer.className = 'success';
                resultContainer.innerHTML = 'Success';
            } else if (data.status === 'error') {
                resultContainer.className = 'error';
                resultContainer.innerHTML = data.reason;
            } else if (data.status === 'progress') {
                resultContainer.className = 'progress';
                setTimeout(() => {
                    fetchJSONFile();
                }, data.timeout);
            }
        }
    }
}

function removeAllErrorClasses(){
    const fio = document.getElementById('fio'),
        phone = document.getElementById('phone'),
        email = document.getElementById('email');

    fio.className = '';
    phone.className = '';
    email.className = '';
}

function setErrorClass(errorFields){
    errorFields.map((errorFieldName) => {
         let errorField = document.getElementById(errorFieldName);

         errorField.className = "error";
    });
}

function validateFio(fio){
    if (fio.split(" ").length === 3){
        return true;
    } else{
        return false;
    }
}

function validateEmail(email){
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        domainArray = ['ya.ru', 'yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com'],
        isEmailValid = false;

    if (emailRegex.test(email)){
        domainArray.map((domain) => {
            if (email.includes(domain)){
                isEmailValid = true;
            }
        });
    } 

    return isEmailValid;
}

function validatePhone(phone){
    let sum = 0,
        arrayNumber = phone.match(/\d/g);

    if (arrayNumber === null){
        arrayNumber = [];
    }
    
    arrayNumber.map((number) => {
        sum += parseInt(number);
    });

    if (sum < 30 && arrayNumber.length === 11){
        return true;
    } else {
        return false;
    }
}