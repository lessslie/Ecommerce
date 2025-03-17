import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
  BadRequestException,
  NotFoundException,
  DefaultValuePipe,
  Optional,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from 'src/entities/products.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateProductDto } from 'src/dtos/orders.dto';
import { CreateProductDto } from 'src/dtos/products.dto';
import { 
  ApiBearerAuth, 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery, 
  ApiBody
} from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Generar productos de prueba' })
  @ApiResponse({
    status: 200,
    description: 'Datos de productos de prueba generados correctamente',
  })
  @Get('seeder')
  seedProduct() {
    return this.productsService.seedProducts();
  }

  @ApiOperation({ summary: 'Obtener lista de productos paginada' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página',
    example: '1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Cantidad de productos por página',
    example: '5',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos obtenida correctamente',
    type: [Product],
  })
  @Get()
  async getProducts(
    @Query('page', new DefaultValuePipe('1')) @Optional() page: string, // Página por defecto es 1
    @Query('limit', new DefaultValuePipe('5')) @Optional() limit: string, // Límite por defecto es 5
  ): Promise<Product[]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    return await this.productsService.getProductsService(
      pageNumber,
      limitNumber,
    );
  }

  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único del producto (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado',
    type: Product,
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  @Get(':id')
  async getProduct(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.productsService.getProduct(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @ApiOperation({ summary: 'Crear nuevo producto' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Producto creado correctamente',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de producto inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  addProduct(@Body() productDto: CreateProductDto) {
    return this.productsService.addProduct(productDto);
  }

  @ApiOperation({ summary: 'Actualizar producto existente' })
  @ApiParam({
    name: 'id',
    description: 'ID único del producto a actualizar (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado correctamente',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        message: { type: 'string', example: 'Producto actualizado exitosamente' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de actualización inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Se requiere rol de administrador',
  })
  @ApiBearerAuth()
  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateProductDto,
  ) {
    console.log('Datos recibidos en controlador:', updateData);
    try {
      const result = await this.productsService.updateProduct(id, updateData);
      return {
        success: true,
        id: result,
        message: 'Producto actualizado exitosamente',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({ summary: 'Eliminar producto' })
  @ApiParam({
    name: 'id',
    description: 'ID único del producto a eliminar (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto eliminado correctamente',
    schema: {
      type: 'string',
      example: 'Producto eliminado correctamente',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteProduct(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    return await this.productsService.deleteProduct(id);
  }
}