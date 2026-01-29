import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { BookmarksController } from "./bookmarks.controller";
import { BookMarksService } from "./bookmarks.service";

@Module({
  imports: [PrismaModule],
  controllers: [BookmarksController],
  providers: [BookMarksService],
})
export class BookmarksModule {}