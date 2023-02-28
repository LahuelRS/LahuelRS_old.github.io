/* Fuentes de consulta: 
    https://randomuser.me/documentation#howto
    https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch
    https://es.stackoverflow.com/questions/407148/problemas-con-fetch-cors-y-los-headers
*/


const ids=['fullname','picture','phone','email'];

const api={
    /*Invoco el parametro ?gender=male al url, para limitar resultados a perfiles masculinos*/
    url:'https://randomuser.me/api/?gender=male', reader:function(data){
        let datosRandomUser=[];
        const res=data.results[0];
        datosRandomUser.picture=res.picture.large;
        datosRandomUser.fullname=res.name.first+" "+res.name.last;
        datosRandomUser.email=res.email;
        datosRandomUser.phone=res.phone;
        return datosRandomUser;
    },
};

function update_localStore(data) {
    for (let id of ids) {
        if (data.hasOwnProperty(id)) {
            localStorage.setItem(id, data[id]);
        } else {
            console.log('Los datos carecen de propiedades: id=' + id + ' , data=' + data);
        }
    }
    return data;
}

function retrieve_data_from_localStore() {
    let ret = [];
    if (localStorage == null) {
        return null;
    }
    for (let id of ids) {
        const value = localStorage.getItem(id);
        if (value == null) {
            console.log('No hay item para la id=' + id);
            return null;
        }
        ret[id] = value;
    }
    return ret;
}

function llenar_cv(data) {
    for (let id of ids) {
        const elem = document.getElementById(id);
        if (elem === null || elem === undefined) {
            console.log('No hay tal elemeto para la id=' + id);
            continue;
        }
        if (id == 'picture') {
            elem.src = data[id];
        } else {
            elem.innerText = data[id];
        }
    }
}

function reload() {
    fetch(api.url, { mode: 'cors' })
        .then((response) => response.json())
        .then((data) => api.reader(data))
        .then((data) => update_localStore(data))
        .then((data) => llenar_cv(data));
}

let data=retrieve_data_from_localStore();

if(data == null ) {
    reload();
} else {
    llenar_cv(data);
}
