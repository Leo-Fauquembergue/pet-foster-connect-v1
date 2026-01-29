import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

// On mock argon2 pour éviter de faire du vrai hashing lent pendant les tests
jest.mock('argon2');

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrisma = {
    pfcUser: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('doit créer un utilisateur avec un mot de passe hashé', async () => {
      (argon2.hash as jest.Mock).mockResolvedValue('hashed_password');
      mockPrisma.pfcUser.create.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: 'hashed_password',
        role: 'individual',
      });

      const dto = {
        email: 'test@test.com',
        password: 'password123',
        role: 'individual' as any,
        phoneNumber: '0600000000',
        address: 'Paris',
      };

      const result = await service.create(dto);

      expect(argon2.hash).toHaveBeenCalledWith('password123');
      expect(mockPrisma.pfcUser.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: dto.email,
          password: 'hashed_password', // On vérifie que c'est le hash qui est passé
        }),
      });
      expect(result.id).toBe(1);
    });
  });

  describe('findOne', () => {
    it('doit retourner un utilisateur par ID', async () => {
      const mockUser = { id: 1, email: 'test@test.com' };
      mockPrisma.pfcUser.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
    });
  });
});