import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

window.addEventListener("beforeunload", function(e){
  // var confirmationMessage = "\o/";
  // alert("closing the tab so do your small interval actions here like cookie removal etc but you cannot stop customer from closing");
  // (e || window.event).returnValue = confirmationMessage; //Gecko + IE
  // return confirmationMessage;   

})