import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { extname } from 'path';
import 'multer';

@Injectable()
export class StorageService {
  private storage: Storage;
  // Reemplaza esto con el nombre de tu bucket de GCP
  private bucketName = 'buket-help-desk';

  constructor() {
    this.storage = new Storage({
      projectId: 'project-7553af17-b847-4316-ab4',
    });
  }

  // Método principal que llamará tu TicketService
  async uploadImages(files: Array<Express.Multer.File>): Promise<string[]> {
    if (!files || files.length === 0) return [];

    // Convertimos cada archivo en una "Promesa" de subida
    const uploadPromises = files.map((file) => this.uploadSingleImage(file));

    // Ejecutamos todas al mismo tiempo
    return Promise.all(uploadPromises);
  }

  // Método privado para subir una sola imagen a GCP
  private async uploadSingleImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const bucket = this.storage.bucket(this.bucketName);
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
      const fileReference = bucket.file(uniqueName);

      const blobStream = fileReference.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
      });

      blobStream.on('error', (err) => reject(err));

      blobStream.on('finish', () => {
        // Formato estándar de URL pública de GCP
        const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${fileReference.name}`;
        resolve(publicUrl);
      });

      blobStream.end(file.buffer); // Enviamos el archivo
    });
  }
}
