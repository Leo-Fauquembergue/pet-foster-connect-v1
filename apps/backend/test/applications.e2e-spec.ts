import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as argon2 from 'argon2';

describe('Applications (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  
  // Données de test
  let jwtToken: string;
  let animalId: number;
  const testEmail = `test-e2e-${Date.now()}@user.com`; // Email unique à chaque lancement
  
  beforeAll(async () => {
    // Initialisation de l'application complète (comme en prod)
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Important : Activer la validation (DTOs) pour que les tests reflètent la réalité
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    
    await app.init();
    prisma = app.get<PrismaService>(PrismaService);

    // PRÉPARATION : Création d'un utilisateur "Adoptant" en BDD
    const password = await argon2.hash('Password123!');
    await prisma.pfcUser.create({
      data: {
        email: testEmail,
        password: password,
        role: 'individual',
        address: '10 Rue Test',
      },
    });

    // PRÉPARATION : Récupération d'un animal existant (du seed)
    const animal = await prisma.animal.findFirst({
        where: { animalStatus: 'available' }
    });
    
    if (!animal) {
        throw new Error("🚨 Erreur: La base de données doit contenir au moins un animal (lance le seed !)");
    }
    animalId = animal.id;
  });

  afterAll(async () => {
    // Nettoyage : On supprime l'utilisateur de test et ses données associées (cascade)
    await prisma.pfcUser.deleteMany({
        where: { email: testEmail }
    });
    await app.close();
  });

  // SCÉNARIO DE TEST

  it('/auth/login (POST) - Doit récupérer un Token JWT', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testEmail,
        password: 'Password123!',
      })
      .expect(201)
      .expect((res) => {
        // On vérifie qu'on reçoit bien un token
        expect(res.body).toHaveProperty('access_token');
        jwtToken = res.body.access_token; // On stocke le token pour la suite
      });
  });

  it('/applications (POST) - Doit créer une demande d\'adoption', () => {
    return request(app.getHttpServer())
      .post('/applications')
      .set('Authorization', `Bearer ${jwtToken}`) // ✅ On attache le Token
      .send({
        animalId: animalId,
        applicationType: 'adoption',
        message: 'Bonjour, je souhaite adopter cet animal. J\'ai un jardin.',
      })
      .expect(201) // 201 Created
      .expect((res) => {
        expect(res.body).toHaveProperty('applicationStatus', 'pending');
        expect(res.body).toHaveProperty('animalId', animalId);
      });
  });

  it('/applications (POST) - Doit bloquer les doublons (Même user, même animal)', () => {
    return request(app.getHttpServer())
      .post('/applications')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        animalId: animalId,
        applicationType: 'adoption',
        message: 'Je tente de spammer...',
      })
      .expect(409); // 409 Conflict (Géré par Prisma ou ton Service)
  });
});