import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from './dto/pagination.dto';

// type MongoRange = {
//   $gte?: number;
//   $lte?: number;
// };
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  /* =======================
     CREATE PRODUCT
  ======================= */
  async create(dto: CreateProductDto): Promise<ProductDocument> {
    const product = new this.productModel(dto);
    return product.save();
  }

  async findAll(query: PaginationDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Mongo query filter
    const filter: Record<string, unknown> = {};

    // price filter type
    type PriceFilter = {
      $gte?: number;
      $lte?: number;
    };

    /* =======================
     SEARCH
  ======================= */
    if (query.search) {
      filter['name'] = {
        $regex: query.search,
        $options: 'i',
      };
    }

    /* =======================
     BRAND FILTER
  ======================= */
    if (query.brand) {
      filter['brand'] = query.brand;
    }

    /* =======================
     PRICE FILTER
  ======================= */
    if (query.minPrice || query.maxPrice) {
      const priceFilter: PriceFilter = {};

      if (query.minPrice) {
        priceFilter.$gte = Number(query.minPrice);
      }

      if (query.maxPrice) {
        priceFilter.$lte = Number(query.maxPrice);
      }

      filter['price'] = priceFilter;
    }

    /* =======================
     SORTING
  ======================= */
    const sort: Record<string, 1 | -1> = {};

    if (query.sort) {
      if (query.sort.startsWith('-')) {
        sort[query.sort.slice(1)] = -1;
      } else {
        sort[query.sort] = 1;
      }
    }

    const [items, total] = await Promise.all([
      this.productModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),

      this.productModel.countDocuments(filter),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /* =======================
     GET SINGLE PRODUCT
  ======================= */
  async findOne(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id).lean().exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  /* =======================
     UPDATE PRODUCT
  ======================= */
  async update(id: string, dto: UpdateProductDto): Promise<ProductDocument> {
    const product = await this.productModel
      .findByIdAndUpdate(id, dto, {
        new: true,
        runValidators: true,
      })
      .lean()
      .exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  /* =======================
     DELETE PRODUCT
  ======================= */
  async delete(id: string): Promise<{ message: string }> {
    const result = await this.productModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException('Product not found');
    }

    return { message: 'Product deleted successfully' };
  }
}
