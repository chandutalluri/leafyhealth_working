"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTranslationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_translation_dto_1 = require("./create-translation.dto");
class UpdateTranslationDto extends (0, swagger_1.PartialType)(create_translation_dto_1.CreateTranslationDto) {
}
exports.UpdateTranslationDto = UpdateTranslationDto;
//# sourceMappingURL=update-translation.dto.js.map