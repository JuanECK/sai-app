import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  // data = this.matDialog.data.data.error
  
  ngOnInit(): void {
    // console.log(this.matDialog.data.data)
    
  }
}
