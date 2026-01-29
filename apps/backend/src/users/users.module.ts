// src/users/users.module.ts
import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController], // déclare le contrôleur
  providers: [UsersService, PrismaService], // déclare les services
  exports: [UsersService], // exporte le service pour l'utiliser dans d'autres modules
})
export class UsersModule {}
