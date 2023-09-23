import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATABASE_CONFIG } from '@app/common/config';

@Module({
  imports: [
    TypeOrmModule.forRoot(DATABASE_CONFIG),
  ],
})
export class AppModule {}
