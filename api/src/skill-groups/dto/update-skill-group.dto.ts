import { PartialType } from '@nestjs/mapped-types';
import { CreateSkillGroupDto } from './create-skill-group.dto';

export class UpdateSkillGroupDto extends PartialType(CreateSkillGroupDto) { }
