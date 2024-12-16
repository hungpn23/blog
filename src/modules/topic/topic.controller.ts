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

  @ApiEndpoint({ type: Topic })
  @Post()
  async create(
    @JwtPayload() { userId }: JwtPayloadType,
    @Body() dto: CreateTopicDto,
  ): Promise<Topic> {
    return await this.topicService.create(userId, dto);
  }

  @ApiEndpoint({ type: Topic })
  @Get()
  async findAll(): Promise<Topic[]> {
    return await this.topicService.findAll();
  }

  @ApiEndpoint({
    type: Topic,
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
    params: [{ name: 'topicId' }],
  })
  @Delete(':topicId')
  async remove(@Param('topicId', ParseUUIDPipe) topicId: Uuid): Promise<Topic> {
    return await this.topicService.remove(topicId);
  }
}
