jest.mock('@nestjs/common', () => {
    const originalModule = jest.requireActual('@nestjs/common');
    return {
        ...originalModule,
        Controller: () => (target: any) => target,
        Get: () => (target: any, key: any, descriptor: any) => descriptor,
        Post: () => (target: any, key: any, descriptor: any) => descriptor,
        Patch: () => (target: any, key: any, descriptor: any) => descriptor,
        Delete: () => (target: any, key: any, descriptor: any) => descriptor,
        Body: () => () => {},
        Param: () => () => {},
        Req: () => () => {},
        Query: () => () => {},
        ParseIntPipe: class {},
    };
});

import { AnimalsController } from './animals.controller';

describe('AnimalsController', () => {
    let controller: AnimalsController;
    let mockService: any;

    beforeEach(() => {
        jest.clearAllMocks();

        mockService = {
            findOne: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findAllByShelter: jest.fn(),
        };
        controller = new AnimalsController(mockService);
    });

    describe('findOne', () => {
        it('devrait appeler le service avec les bons paramètres et retourner l animal', async () => {
            
            const animalId = 1;
            const userId = 42;
            const mockRequest = { user: { id: userId } };
            const fakeAnimal = { id: animalId, name: 'Rex' };

            mockService.findOne.mockResolvedValue(fakeAnimal);

            
            const result = await controller.findOne(animalId, mockRequest);

            expect(mockService.findOne).toHaveBeenCalledWith(animalId, userId);
            expect(result).toEqual(fakeAnimal);
        });
    });
});