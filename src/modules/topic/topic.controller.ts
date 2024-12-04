import { JwtPayload } from '@/decorators/jwt-payload.decorator';
import { Uuid } from '@/types/branded.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { JwtPayloadType } from '../auth/auth.type';
import { CreateTopicDto, UpdateTopicDto } from './topic.dto';
import { Topic } from './topic.entity';
import { TopicService } from './topic.service';

@SerializeOptions({ type: Topic })
@Controller('topic')
export class TopicController {
  constructor(private topicService: TopicService) {}

  @Post()
  async create(
    @JwtPayload() { userId }: JwtPayloadType,
    @Body() dto: CreateTopicDto,
  ): Promise<Topic> {
    return await this.topicService.create(userId, dto);
  }

  @Get()
  async findAll(): Promise<Topic[]> {
    return await this.topicService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: Uuid): Promise<Topic> {
    return await this.topicService.findOne(id);
  }

  @Patch(':id')
  async update(
    @JwtPayload() { userId }: JwtPayloadType,
    @Param('id', ParseUUIDPipe) topicid: Uuid,
    @Body() dto: UpdateTopicDto,
  ): Promise<Topic> {
    return await this.topicService.update(userId, topicid, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: Uuid): Promise<Topic> {
    return await this.topicService.remove(id);
  }
}
