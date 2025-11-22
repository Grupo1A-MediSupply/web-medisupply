import { Component } from '@angular/core';

@Component({
  templateUrl: './upload.component.html'
})
export class UploadComponent {
  selectedFile: File | null = null;
  uploadMessage: string = '';
  showUploadSuccess: boolean = false;

  onFile(e: any) {
    if (!e || !e.target || !e.target.files) {
      return;
    }
    const file = e.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadMessage = `Archivo seleccionado: ${file.name}`;
      this.showUploadSuccess = false;
    }
  }

  downloadTemplate() {
    // Simular descarga de plantilla
    this.uploadMessage = 'Descarga de plantilla CSV iniciada...';
    this.showUploadSuccess = true;
    setTimeout(() => {
      this.uploadMessage = 'Plantilla descargada exitosamente';
    }, 1000);
  }

  uploadFile() {
    if (!this.selectedFile) {
      this.uploadMessage = 'Por favor, seleccione un archivo primero';
      this.showUploadSuccess = false;
      return;
    }

    // Simular carga
    this.uploadMessage = 'Procesando archivo...';
    this.showUploadSuccess = false;
    
    setTimeout(() => {
      this.uploadMessage = `Archivo "${this.selectedFile?.name}" procesado exitosamente. El inventario ha sido actualizado.`;
      this.showUploadSuccess = true;
      this.selectedFile = null;
      
      // Limpiar el input
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }, 2000);
  }

  clearUpload() {
    this.selectedFile = null;
    this.uploadMessage = '';
    this.showUploadSuccess = false;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
