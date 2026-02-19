import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
  ) {}

  // Centralized error handling
  private async findByIdOrFail(id: string): Promise<ProductDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Invalid product ID: ${id}`);
    }

    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException(`Product with ID "${id}" not found`);
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const product = new this.productModel(dto);
    return product.save();
  }

  async findAll(limit = 20, page = 1): Promise<Product[]> {
    return this.productModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async findOne(id: string): Promise<Product> {
    return this.findByIdOrFail(id);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findByIdOrFail(id);
    Object.assign(product, dto);
    return product.save();
  }

  async delete(id: string): Promise<Product> {
    const product = await this.findByIdOrFail(id);
    await product.deleteOne();
    return product;
  }
}
