loginData = {
    'email':"",
    'password':""
}
const checkAuth = async () =>
{
    const token = localStorage.getItem('token');
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8000/api/',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });


    axiosInstance.get('checkAuth')
    .then(response => {
        
    })
    .catch(error => {
        window.location.href = "index.html"
    });
}


const checkGuest = async () =>
{
    const token = localStorage.getItem('token');
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8000/api/',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });


    axiosInstance.get('checkAuth')
    .then(response => {
        window.location.href = "user.html"
    })
    .catch(error => {
        
    });
}

registerData = {
    'email':'',
    'name':'',
    'password':'',
    'password_confirmation':'',
}

verifyData ={
    'token':"",
    'email':'',
    'name':'',
    'password':''
};

function setCookie(cookieName, cookieValue, expirationDays) {
 
    const d = new Date();
    d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();

    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for(let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

const handleChange = (element) =>
{
    registerData[element.getAttribute('name')] = element.value;
}

const handleSubmitRegister = () =>
{
    Swal.fire({
        title: "Are you sure with the inserted details?",
       
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          submitRegister()
        }
      });
}

const handleChangeLogin = (element) =>
{
    loginData[element.getAttribute('name')] = element.value;
}

const handleLogin = async () =>
{
    try
    {
        const login = await axios.post('http://localhost:8000/api/login',loginData)
        localStorage.setItem('token',login.data.token)
        
        window.location.href = 'user.html'
    }
    catch(error)
    {
        Swal.fire("", error.response.data.message, "error");
    }
}


const getUser = async () =>
{
    const token = localStorage.getItem('token');
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8000/api/',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });


    axiosInstance.get('user')
    .then(response => {
       const name = response.data.data.name;
       document.getElementById('profilename').innerText = name;
    })
    .catch(error => {
        console.log(error)
    });
}

const logout = async () =>
{
    const token = localStorage.getItem('token');
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8000/api/',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    axiosInstance.get('logout')
    .then(response => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    })
    .catch(error => {
        console.error('Error:', error.response.data);
    });
}

const submitRegister = async () =>
{
    try{
        const register = await axios.post('http://localhost:8000/api/register',registerData)
        setCookie('email',registerData['email'])
        setCookie('name',registerData['name'])
        setCookie('password',registerData['password'])
        Swal.fire({
            title: "",
            text: register.data.message,
            icon: "success",
            didRender: () => {
                
                setTimeout(() => {
                    window.location.href = "verification.html";
                }, 1500); 
            }
        });
        
    }catch(err){
        console.log(err)
        if(err.response.status == 402)
        {
            Swal.fire("", err.response.data.data, "error");
        }else if(err.response.status == 401)
        {
            Swal.fire("", err.response.data.message, "error");
        }else{
            console.log(err)
            Swal.fire("", "Please contact the system admin for help", "error");
        }
    }
}

const handleverifyChange = (element) =>
{
    verifyData[element.getAttribute('name')] = element.value;
}

const handleSubmitVerify = async () =>
{
    try{
        verifyData['email'] = getCookie('email');
        verifyData['name'] = getCookie('name');
        verifyData['password'] = getCookie('password');
        const verify = await axios.post('http://localhost:8000/api/verify',verifyData)
        Swal.fire({
            title: "",
            text: verify.data.message,
            icon: "success",
            didRender: () => {
                
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500); 
            }
        });
    }catch(err)
    {
        if(err.response.status == 402)
        {
            Swal.fire("", err.response.data.message, "error");
        }else if(err.response.status == 401)
        {
            Swal.fire("", err.response.data.message, "error");
        }else{
            console.log(err)
            Swal.fire("", "Please contact the system admin for help", "error");
        } 
    }
}