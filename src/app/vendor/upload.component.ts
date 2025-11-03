import { Component } from '@angular/core';

@Component({
  template: `
  <h2>Carga de Inventario</h2>
  <p class="small-note">Carga masiva (CSV/Excel) para actualizar inventario, fichas técnicas, certificados y precios.</p>
  <div class="upload-card">
    <input type="file" (change)="onFile($event)" />
    <div style="margin-top:12px">
      <button mat-stroked-button (click)="downloadTemplate()">Descargar plantilla CSV</button>
    </div>
  </div>
  `,
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
