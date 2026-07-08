import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';

import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from './dto/pagination.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enum';

import { CloudinaryService } from '../cloudinary/service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /* =======================
     CREATE PRODUCT (ADMIN)
  ======================= */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: memoryStorage(),

      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },

      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }

        cb(null, true);
      },
    }),
  )
  // async create(@Body() dto: CreateProductDto, @UploadedFiles() files: any[]) {
  //   let imageUrls: string[] = [];

  //   if (files?.length) {
  //     imageUrls = await Promise.all(
  //       files.map((file) => this.cloudinaryService.uploadImage(file)),
  //     );
  //   }

  //   return this.productsService.create({
  //     ...dto,
  //     images: imageUrls,
  //   });
  // }
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log('DTO:', dto);

    console.log(
      'FILES:',
      files?.map((f) => ({
        name: f.originalname,
        size: f.size,
        type: f.mimetype,
      })),
    );

    return { success: true };
  }

  /* =======================
     GET PRODUCTS (PUBLIC)
  ======================= */
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.productsService.findAll(pagination);
  }

  /* =======================
     GET ONE PRODUCT (PUBLIC)
  ======================= */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  /* =======================
     UPDATE PRODUCT (ADMIN)
  ======================= */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: memoryStorage(),

      limits: {
        fileSize: 5 * 1024 * 1024,
      },

      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }

        cb(null, true);
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFiles() files: any[],
  ) {
    let imageUrls: string[] = [];

    if (files?.length) {
      imageUrls = await Promise.all(
        files.map((file) => this.cloudinaryService.uploadImage(file)),
      );
    }

    return this.productsService.update(id, {
      ...dto,
      ...(imageUrls.length > 0 && { images: imageUrls }),
    });
  }

  /* =======================
     DELETE PRODUCT (ADMIN)
  ======================= */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
