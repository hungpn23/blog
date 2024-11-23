import { JwtPayload } from '@/decorators/jwt-payload.decorator';
import { Uuid } from '@/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
    @JwtPayload() payload: JwtPayloadType,
    @Body() dto: CreateTopicDto,
  ): Promise<Topic> {
    return await this.topicService.create(payload, dto);
  }

  @Get()
  async findAll(): Promise<Topic[]> {
    return await this.topicService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: Uuid): Promise<Topic> {
    return await this.topicService.findOne(id);
  }

  @Patch(':id')
  async update(
    @JwtPayload() payload: JwtPayloadType,
    @Param('id') id: Uuid,
    @Body() dto: UpdateTopicDto,
  ): Promise<Topic> {
    return await this.topicService.update(payload, id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: Uuid): Promise<Topic> {
    return await this.topicService.remove(id);
  }
}
