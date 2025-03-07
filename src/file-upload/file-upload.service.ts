import { Injectable, NotFoundException } from "@nestjs/common";
import { FileUpLoadRepository } from "./file-upload.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "src/entities/products.entity";
import { Repository } from "typeorm";

@Injectable()
export class FileUpLoadService{
    constructor(
        private readonly fileUpLoadRepository: FileUpLoadRepository,
        @InjectRepository(Product)
        private readonly productsRepository : Repository<Product>,
    ){}
    async uploadProductImage(file : Express.Multer.File, productId : string){
        const product = await this.productsRepository.findOneBy({id:productId});

        if(!product){
            throw new NotFoundException('Product not found');
        }
        const uploadedImage = await this.fileUpLoadRepository.uploadImage(file);
        console.log(uploadedImage);

        await this.productsRepository.update(product.id,{
            imgUrl:uploadedImage.secure_url,
        });

        const updatedProduct = await this.productsRepository.findOneBy({
            id:productId,
        });

        return updatedProduct;
    }











}