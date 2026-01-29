import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";

@ApiTags("app")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: "Message de bienvenue de l'API" })
  @ApiResponse({
    status: 200,
    description: "Message de bienvenue retourné avec succès",
    schema: {
      type: "string",
      example: "Hello World!",
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
