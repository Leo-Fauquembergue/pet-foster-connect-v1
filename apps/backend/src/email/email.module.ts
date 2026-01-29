import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

@Module({
  providers: [EmailService],
  controllers: [EmailController],
  exports: [EmailService], // 👈 pour l’utiliser dans ApplicationsController
})
export class EmailModule {}
