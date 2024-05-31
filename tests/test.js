const form =  document.querySelector('form');

url = 'http://0.0.0.0:8000/Api/v1'

async function sigin(){
    const data = {
        "username": "hucks",
        "password": "hucks"
    }

   let res = await fetch(url + '/login',{
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
    })
    let obj = await res.json()
    console.log(obj.token) 
    return  obj.token
}


async function upload(raw){

    let token = await sigin()
    console.log(raw[0])
    let data = new FormData()
    data.append('file', raw[0])
    
    let res = await fetch(url + '/files/upload',{
            method: "POST",
            headers:{
                "Authorization": "Bearer " + token 
            },
            body: data
    })
    let obj = await res.json()
    console.log(obj) 
}





form.addEventListener('submit', function(e){
    e.preventDefault()
   file = form.file.files;
   upload(file)
})