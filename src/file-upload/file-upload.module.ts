import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadController } from './file-upload.controller';
import { FileUpLoadService } from './file-upload.service';
import { FileUpLoadRepository } from './file-upload.repository';
import { Product } from 'src/entities/products.entity';
import { CloudinaryConfig } from '../config/cloudinary';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [FileUploadController],
  providers: [FileUpLoadService, FileUpLoadRepository, CloudinaryConfig],
})


export class FileUploadModule {}