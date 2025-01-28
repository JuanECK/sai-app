export class servicioGuardian {
    constructor(){}

public async servicio(){
    try {
        let dato 
        const cookie = this.getCookie();
         fetch('http://localhost:3000/validaSession', {
          method: 'POST',
          mode:"cors",
          credentials:"same-origin",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              Usuario: cookie[0][1],
          })
        })
        .then((response) => response.json())
          .then((result) => {
              dato = result
              return dato
          })
          .catch((error) => {
            console.error('Error:', error);
          });
  

    } catch (error) {
        
    }
}
getCookie(){
    return document.cookie.split("; ").filter(c=>/^auth_access_token.+/.test(c))
   .map(e=>e.split("="));
   // console.log(res[0][0]);
 }

}