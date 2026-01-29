import { 
  Injectable, 
  ConflictException 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationStatus, CreateApplicationDto, UpdateApplicationStatusDto } from '@projet/shared-types';
import { Prisma } from '@prisma/client'; // Pour le typage des erreurs

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  // Créer une demande (Candidat)
  async create(userId: number, createDto: CreateApplicationDto) {
    try {
      // On tente de créer
      return await this.prisma.application.create({
        data: {
          pfcUserId: userId,
          animalId: createDto.animalId,
          applicationType: createDto.applicationType,
          message: createDto.message,
          // Statut par défaut défini dans le schema Prisma (pending)
        },
        include: {
          animal: true, // On renvoie les infos de l'animal pour confirmer
        }
      });
    } catch (error) {
      // GESTION DES ERREURS PRISMA
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002 = Violation de contrainte unique (Doublon)
        if (error.code === 'P2002') {
          throw new ConflictException(
            'Vous avez déjà envoyé une demande pour cet animal.'
          );
        }
      }
      // Si c'est une autre erreur, on laisse planter (500)
      throw error; 
    }
  }

 // Voir mes demandes envoyées (Candidat)
  findAllSent(userId: number) {
    return this.prisma.application.findMany({
      where: { 
        pfcUserId: userId,
        deletedAt: null, // On exclut les archivées
      },
      include: {
        animal: true, // L’animal concerné
        user: {       // Le candidat
          select: {
            id: true,
            email: true, 
            phoneNumber: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
  

  // Voir les demandes reçues (Refuge)
  // On cherche les demandes sur les animaux qui appartiennent à ce refuge
  
  findAllReceived(shelterId: number) {
    return this.prisma.application.findMany({
      where: {
        animal: {
          pfcUserId: shelterId,
        },
        deletedAt: null,
      },
      select: {
        pfcUserId: true,       // <-- clé primaire
        animalId: true,        // <-- clé primaire
        message: true,
        applicationType: true,
        applicationStatus: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
            phoneNumber: true,   // <-- ici le numéro
            individualProfile: true,
          },
        },
        animal: {
          select: {
            id: true,
            name: true,
            photos: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
  

  // Mettre à jour le statut (Refuge)
  async updateStatus(
    candidateId: number, 
    animalId: number, 
    updateDto: UpdateApplicationStatusDto
  ) {
    return this.prisma.application.update({
      where: {
        pfcUserId_animalId: {
          pfcUserId: candidateId,
          animalId: animalId,
        },
      },
      data: {
        applicationStatus: updateDto.applicationStatus as ApplicationStatus,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            individualProfile: true,
          },
        },
        animal: {
          select: {
            id: true,
            name: true,
            photos: true,
          },
        },
      },
    });
  }
  

  // Supprimer/Archiver (Soft Delete)
  remove(candidateId: number, animalId: number) {
    return this.prisma.application.update({
      where: {
        pfcUserId_animalId: {
          pfcUserId: candidateId,
          animalId: animalId,
        },
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}