import { ApiEndpoint } from '@/decorators/endpoint.decorator';
import { JwtPayload } from '@/decorators/jwt-payload.decorator';
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
import { JwtPayloadType } from '../auth/auth.type';
import { CreateTopicDto, UpdateTopicDto } from './topic.dto';
import { Topic } from './topic.entity';
import { TopicService } from './topic.service';

@Controller('topic')
export class TopicController {
  constructor(private topicService: TopicService) {}

  @ApiEndpoint({
    type: Topic,
    summary: 'create a new topic',
  })
  @Post()
  async create(
    @JwtPayload() { userId }: JwtPayloadType,
    @Body() dto: CreateTopicDto,
  ): Promise<Topic> {
    return await this.topicService.create(userId, dto);
  }

  @ApiEndpoint({
    type: Topic,
    summary: 'get all topic',
  })
  @Get()
  async findAll(): Promise<Topic[]> {
    return await this.topicService.findAll();
  }

  @ApiEndpoint({
    type: Topic,
    summary: 'get a topic by id',
    params: [{ name: 'topicId' }],
  })
  @Get(':topicId')
  async findOne(
    @Param('topicId', ParseUUIDPipe) topicId: Uuid,
  ): Promise<Topic> {
    return await this.topicService.findOne(topicId);
  }

  @ApiEndpoint({
    type: Topic,
    summary: 'update a topic by id, return updated topic',
    params: [{ name: 'topicId' }],
  })
  @Patch(':topicId')
  async update(
    @JwtPayload() { userId }: JwtPayloadType,
    @Param('topicId', ParseUUIDPipe) topicId: Uuid,
    @Body() dto: UpdateTopicDto,
  ): Promise<Topic> {
    return await this.topicService.update(userId, topicId, dto);
  }

  @ApiEndpoint({
    type: Topic,
    summary: 'delete a topic by id, return deleted topic',
    params: [{ name: 'topicId' }],
  })
  @Delete(':topicId')
  async remove(@Param('topicId', ParseUUIDPipe) topicId: Uuid): Promise<Topic> {
    return await this.topicService.remove(topicId);
  }
}
