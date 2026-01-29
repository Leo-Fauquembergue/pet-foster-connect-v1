/**
 * ============================================================================
 * 🛠 PRISMA SERVICE - Cœur de la Persistance NestJS
 * ============================================================================
 * * ROLE :
 * Ce service agit comme un "pont" entre le code NestJS et la base de données 
 * PostgreSQL. Il étend le 'PrismaClient' généré automatiquement.
 * * FONCTIONNEMENT :
 * 1. Extension : Il hérite de toutes les méthodes de Prisma (findUnique, create, etc.).
 * 2. Cycle de vie (OnModuleInit) : On force la connexion à la DB dès que le 
 * module est chargé pour éviter les délais sur la première requête.
 * 3. Cycle de vie (OnModuleDestroy) : On ferme proprement la connexion pour 
 * éviter les fuites de mémoire (memory leaks) lors de l'arrêt du serveur.
 * * UTILISATION :
 * Pour l'utiliser dans un autre service (ex: UserService), injectez-le 
 * via le constructeur :
 * constructor(private prisma: PrismaService) {}
 * * NOTE AUX APPRENANTS :
 * L'import de '../generated/prisma' peut apparaître en rouge tant que la 
 * commande 'npx prisma migrate dev' n'a pas été lancée au moins une fois.
 * ============================================================================
 */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import { PrismaClient } from '../generated/prisma';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  
  async onModuleInit() {
    // Se connecte à la base de données au démarrage du module
    await this.$connect();
  }

  async onModuleDestroy() {
    // Ferme proprement la connexion à la base de données quand le serveur s'arrête
    await this.$disconnect();
  }
}