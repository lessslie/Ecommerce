import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'; 

describe('E2E Tests', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login para obtener token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        // ...credenciales de inicio de sesión...
      });

    authToken = loginResponse.body.token;
  });

  describe('Auth', () => {
    it('/auth/signin (POST) - debe iniciar sesión correctamente', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'lolan@test.com',  // Mismo usuario admin
          password: 'Admin123!'       // Misma contraseña
        })
        .expect(201)
        .expect(res => {
          expect(res.body).toHaveProperty('token');
          expect(res.body).toHaveProperty('message', 'Sesión iniciada exitosamente! 🤗');
        });
    });

    it('/auth/signin (POST) - debería fallar con credenciales incorrectas', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'wrong@test.com',
          password: 'WrongPass123!'
        })
        .expect(401);
    });
  });

  describe('Products', () => {
    it('/products (GET) - debería devolver productos paginados', () => {
      return request(app.getHttpServer())
        .get('/products?page=1&limit=10')
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBeTruthy();
        });
    });

    it('/products/:id (PUT) - debería actualizar el producto por id', () => {
      const updateData = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 150.0,
        stock: 20
      };

      return request(app.getHttpServer())
        .put('/products/10727db4-136b-4db8-8240-58138babe68d') // Ajusta con un ID válido
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);
    });
  });

  describe('Users', () => {
    it('/users (GET) - debería devolver usuarios, solo para administrador', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBeTruthy();
        });
    });

    it('/users/:id (DELETE) - debería eliminar al usuario', () => {
      // Aquí podrías crear un usuario de prueba primero y luego eliminarlo
      const testUserId = '7b918bbe-c529-46d3-a7de-983113349df5'; // Ajusta con un ID válido
      return request(app.getHttpServer())
        .delete(`/users/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});