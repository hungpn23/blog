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
import { CreateTopicDto, UpdateTopicDto } from './topic.dto';
import { TopicEntity } from './topic.entity';
import { TopicService } from './topic.service';

@UseRole(Role.ADMIN) // apply role guard to all endpoints
@Controller({
  path: 'topic',
  version: '1',
})
export class TopicController {
  constructor(private topicService: TopicService) {}

  @ApiEndpoint({
    type: TopicEntity,
    summary: 'create a new topic',
  })
  @Post()
  async create(
    @JwtPayload() { userId }: JwtPayloadType,
    @Body() dto: CreateTopicDto,
  ): Promise<TopicEntity> {
    return await this.topicService.create(userId, dto);
  }

  @ApiEndpoint({
    type: TopicEntity,
    summary: 'get all topic',
  })
  @Get()
  async findAll(): Promise<TopicEntity[]> {
    return await this.topicService.findAll();
  }

  @ApiEndpoint({
    type: TopicEntity,
    summary: 'get a topic by id',
    params: [{ name: 'topicId' }],
  })
  @Get(':topicId')
  async findOne(
    @Param('topicId', ParseUUIDPipe) topicId: Uuid,
  ): Promise<TopicEntity> {
    return await this.topicService.findOne(topicId);
  }

  @ApiEndpoint({
    type: TopicEntity,
    summary: 'update a topic by id, return updated topic',
    params: [{ name: 'topicId' }],
  })
  @Patch(':topicId')
  async update(
    @JwtPayload() { userId }: JwtPayloadType,
    @Param('topicId', ParseUUIDPipe) topicId: Uuid,
    @Body() dto: UpdateTopicDto,
  ): Promise<TopicEntity> {
    return await this.topicService.update(userId, topicId, dto);
  }

  @ApiEndpoint({
    type: TopicEntity,
    summary: 'delete a topic by id, return deleted topic',
    params: [{ name: 'topicId' }],
  })
  @Delete(':topicId')
  async remove(
    @Param('topicId', ParseUUIDPipe) topicId: Uuid,
  ): Promise<TopicEntity> {
    return await this.topicService.remove(topicId);
  }
}
