import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateAnimalDto, UpdateAnimalDto } from "@projet/shared-types";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";


// Animal avec relations species + shelterProfile
type AnimalWithRelations = Prisma.AnimalGetPayload<{
  include: { species: true; shelter: { include: { shelterProfile: true } } };
}>;

// Animal enrichi avec isBookmarked
type AnimalWithBookmark = AnimalWithRelations & { isBookmarked: boolean };


@Injectable()
export class AnimalsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAnimalDto, userId: number) {
    const data: Prisma.AnimalCreateInput = {
      name: dto.name,
      age: dto.age,
      description: dto.description,
      sex: dto.sex,
      weight: dto.weight ? new Prisma.Decimal(dto.weight) : null,
      height: dto.height,
      animalStatus: dto.animalStatus,
      photos: dto.photos,
      acceptOtherAnimals: dto.acceptOtherAnimals,
      acceptChildren: dto.acceptChildren,
      needGarden: dto.needGarden,
      treatment: dto.treatment,
      shelter: { connect: { id: userId } },   // relation vers PfcUser
      species: { connect: { id: dto.speciesId } }, // relation vers Species
    };
  
    return this.prisma.animal.create({ data });
  }
  
  

  async findAll(includeDeleted = false, limit?: number) {
    return this.prisma.animal.findMany({
      where: { 
        // Si includeDeleted est false, on ne veut que deletedAt: null
        deletedAt: includeDeleted ? undefined : null 
      },
      take: limit, // On applique la limite si elle est fournie
      orderBy: { 
        createdAt: 'desc' // On trie toujours du plus récent au plus ancien
      },
      include: {
        species: true,
        shelter: { include: { shelterProfile: true } },
      },
    });
  }

 async findOne(id: number, userId?: number): Promise<AnimalWithBookmark> {
   const animal = await this.prisma.animal.findUnique({
     where: { id },
     include: {
       species: true,
       shelter: { include: { shelterProfile: true } },
       bookmarks: userId ? { where: { pfcUserId: userId } } : false,
     },
   });
 
   if (!animal || animal.deletedAt) {
     throw new NotFoundException(`Animal ${id} non trouvé ou supprimé`);
   }
 
   const isBookmarked = !!animal.bookmarks?.length;
 
   // On supprime bookmarks du retour si tu veux éviter de l’exposer
   const { bookmarks, ...rest } = animal;
 
   return { ...rest, isBookmarked };
 }
  async findAllByShelter(userId: number) {
    return this.prisma.animal.findMany({
      where: { pfcUserId: userId },
      include: { // <--- C'EST CETTE PARTIE QUI MANQUE SÛREMENT
        species: true, // "Va chercher le nom de l'espèce"
        shelter: {     // "Va chercher les infos du refuge"
          include: {
            shelterProfile: true 
          }
        }
      }
    });
  }

  async update(id: number, updateAnimalDto: UpdateAnimalDto) {
    const data: any = {};
    Object.entries(updateAnimalDto).forEach(([key, value]) => {
      if (value !== undefined) data[key] = value;
    });
    return this.prisma.animal.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.animal.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
