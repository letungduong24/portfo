import { PartialType } from '@nestjs/mapped-types';
import { CreateHireMeDto } from './create-hire-me.dto';

export class UpdateHireMeDto extends PartialType(CreateHireMeDto) {}
