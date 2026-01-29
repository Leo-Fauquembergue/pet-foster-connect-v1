import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import type { RegisterDto } from "@projet/shared-types";
import express from "express";
import { JwtAuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "Se connecter" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        email: { type: "string", example: "user@example.com" },
        password: { type: "string", example: "motdepasse123" },
      },
      required: ["email", "password"],
    },
  })
  @ApiResponse({
    status: 201,
    description: "Connexion réussie, token JWT retourné",
  })
  @ApiResponse({ status: 401, description: "Email ou mot de passe incorrect" })
  async login(
    @Body() dto: { email: string; password: string },
    @Res({ passthrough: true }) res: express.Response
  ) {
    const { user, token } = await this.authService.login(dto);
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
      path: "/",
    });
    return {
      user,
      access_token: token,
    };
  }

  @Post("logout")
  @ApiOperation({ summary: "Se déconnecter" })
  @ApiResponse({ status: 201, description: "Déconnexion réussie" })
  logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie("access_token", {
      httpOnly: true,
      sameSite: "lax",
    });
    return { message: "Déconnexion réussie" };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Récupérer les informations de l'utilisateur connecté",
  })
  @ApiResponse({
    status: 200,
    description: "Informations utilisateur retournées avec succès",
  })
  @ApiResponse({ status: 401, description: "Non authentifié" })
  me(@Req() req: any) {
    return req.user;
  }

  @Post("register")
  @ApiOperation({ summary: "Créer un nouveau compte utilisateur" })
  @ApiResponse({
    status: 201,
    description: "Compte créé avec succès, token JWT retourné",
  })
  @ApiResponse({
    status: 400,
    description: "Données invalides ou email déjà utilisé",
  })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: express.Response
  ) {
    const { user, token } = await this.authService.register(dto);
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    });
    return {
      user,
      access_token: token,
    };
  }
}
