import { Component } from '@angular/core';

@Component({
  templateUrl: './upload.component.html',
  styles: [`
    .upload-card {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 16px;
      margin: 16px 0;
      background: #fafafa;
    }
  `]
})
export class UploadComponent {
  onFile(e: any){
    if (!e || !e.target || !e.target.files) {
      return;
    }
    const f = e.target.files[0];
    if(f) alert('Archivo seleccionado: ' + f.name + ' (en prototipo no se procesa realmente)');
  }
  downloadTemplate(){
    alert('Descarga de plantilla CSV (simulada).');
  }
}
