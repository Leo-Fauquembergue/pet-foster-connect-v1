import { BookmarksController } from './bookmarks.controller';

// On empêche NestJS d'exécuter les décorateurs qui font planter Jest
jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  Post: () => jest.fn(),
  Get: () => jest.fn(),
  Body: () => jest.fn(),
  Req: () => jest.fn(),
  UsePipes: () => jest.fn(),
  UseGuards: () => jest.fn(),
  Controller: () => jest.fn(),
}));

describe('BookmarksController', () => {
  let controller: BookmarksController;
  let mockService: any;

  beforeEach(() => {
    // On simule le service
    mockService = {
      toggle: jest.fn().mockResolvedValue({ bookmarked: true }),
      findAllByUser: jest.fn().mockResolvedValue([]),
    };

    // Instanciation manuelle (sans TestingModule pour éviter le crash des décorateurs)
    controller = new BookmarksController(mockService);
  });

  it('devrait appeler toggle avec les bonnes informations', async () => {
    const req = { user: { id: 1 } };
    const dto = { animalId: 10 };

    const result = await controller.toggle(req as any, dto);

    expect(mockService.toggle).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual({ bookmarked: true });
  });
});