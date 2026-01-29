import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SpeciesService } from "./species.service";

@ApiTags("species")
@Controller("species")
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @Get()
  @ApiOperation({ summary: "Récupérer toutes les espèces disponibles" })
  @ApiResponse({
    status: 200,
    description: "Liste des espèces retournée avec succès",
  })
  async findAll() {
    return this.speciesService.findAll();
  }
}
