import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Gérer les cookies
  app.use(cookieParser());

  // Autoriser les requêtes CORS depuis le frontend
  app.enableCors({
    origin: [
      "http://localhost:5173",          // Pour le dev local
      process.env.CORS_ORIGIN || "",    // Pour la prod (Vercel)
    ],
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // Documentation Swagger
  const config = new DocumentBuilder()
    .setTitle("API Adoption Animaux")
    .setDescription(
      "Documentation complète de l'API pour la plateforme d'adoption d'animaux"
    )
    .setVersion("1.0")
    .addTag("animals", "Gestion des animaux")
    .addTag("applications", "Gestion des demandes d'adoption")
    .addTag("auth", "Authentification et autorisation")
    .addTag("bookmarks", "Gestion des favoris")
    .addTag("emails", "Envoi d'emails")
    .addTag("shelters", "Gestion des refuges")
    .addTag("species", "Liste des espèces")
    .addTag("users", "Gestion des utilisateurs")
    .addTag("health", "État de santé de l'API")
    .addTag("app", "Routes générales")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  app.useGlobalPipes();

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
