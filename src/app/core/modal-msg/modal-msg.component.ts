import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlobOptions } from 'buffer';
// import { MatDialogContent, MatDialogModule, MatDialog } from '@angular/material/dialog';
// import { MatFormField, MatFormFieldModule, MatLabel,  } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';


// const MATERIAL_MODULES = [ MatLabel, MatFormFieldModule, MatInputModule, MatDialogContent ];

@Component({
  selector: 'app-modal-msg',
  standalone: true, 
  imports: [],
  // imports: [ MATERIAL_MODULES ],
  templateUrl: './modal-msg.component.html',
  styleUrl: './modal-msg.component.css'
})
export class ModalMsgComponent implements OnInit {
  
  public readonly matDialog = inject(MAT_DIALOG_DATA);
  data = this.matDialog.data.data
  type:boolean = false
  // data = this.matDialog.data.data.error
  ngOnInit(): void {
    console.log(this.matDialog)
    this.typeMensaje(this.matDialog.TypeMsg)

    // setTimeout(()=>{
      
    // },1000)
  }

  typeMensaje( mensaje:string ){
      if(mensaje === 'error'){
        this.type = false
      }else{
        this.type = true
      }
  }
}
