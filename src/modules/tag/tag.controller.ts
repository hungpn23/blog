import { Role } from '@/constants';
import { UseRole } from '@/decorators/auth/role.decorator';
import { ApiEndpoint } from '@/decorators/endpoint.decorator';
import { JwtPayload } from '@/decorators/jwt-payload.decorator';
import { JwtPayloadType } from '@/types/auth.type';
import { type Uuid } from '@/types/branded.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTagDto, UpdateTagDto } from './tag.dto';
import { TagEntity } from './tag.entity';
import { TagService } from './tag.service';

@Controller({
  path: 'tag',
  version: '1',
})
export class TagController {
  constructor(private tagService: TagService) {}

  @UseRole(Role.ADMIN)
  @ApiEndpoint({
    type: TagEntity,
    summary: 'create a new tag',
  })
  @Post()
  async create(
    @JwtPayload() { userId }: JwtPayloadType,
    @Body() dto: CreateTagDto,
  ): Promise<TagEntity> {
    return await this.tagService.create(userId, dto);
  }

  @ApiEndpoint({
    isPublic: true,
    type: TagEntity,
    summary: 'get all tag',
  })
  @Get('all')
  async findAll(): Promise<TagEntity[]> {
    return await this.tagService.findAll();
  }

  @ApiEndpoint({
    isPublic: true,
    type: TagEntity,
    summary: 'get a tag by id',
    params: [{ name: 'tagId' }],
  })
  @Get(':tagId')
  async findOne(
    @Param('tagId', ParseUUIDPipe) tagId: Uuid,
  ): Promise<TagEntity> {
    return await this.tagService.findOne(tagId);
  }

  @UseRole(Role.ADMIN)
  @ApiEndpoint({
    type: TagEntity,
    summary: 'update a tag by id, return updated tag',
    params: [{ name: 'tagId' }],
  })
  @Patch(':tagId')
  async update(
    @JwtPayload() { userId }: JwtPayloadType,
    @Param('tagId', ParseUUIDPipe) tagId: Uuid,
    @Body() dto: UpdateTagDto,
  ): Promise<TagEntity> {
    return await this.tagService.update(userId, tagId, dto);
  }

  @UseRole(Role.ADMIN)
  @ApiEndpoint({
    type: TagEntity,
    summary: 'delete a tag by id, return deleted tag',
    params: [{ name: 'tagId' }],
  })
  @Delete(':tagId')
  async remove(@Param('tagId', ParseUUIDPipe) tagId: Uuid): Promise<TagEntity> {
    return await this.tagService.remove(tagId);
  }
}
