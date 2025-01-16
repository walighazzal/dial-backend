import { Injectable } from '@nestjs/common';
import { CreateRefDatumDto } from './dto/create-ref-datum.dto';
import { UpdateRefDatumDto } from './dto/update-ref-datum.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefRole } from './entities/ref-data.entity';

@Injectable()
export class RefDataService {
  constructor(
    @InjectRepository(RefRole)
    private readonly rolesRepository: Repository<RefRole>,
  ) { }
  onModuleInit() {
    this.seed()
  }
  async seed() {
    await this.seedRoles();
  }


  async getAll(): Promise<any> {
    const roles = await this.rolesRepository.find();

    return {
      roles
    };

  }
  private async seedRoles() {
    const roles = [
      { roleId: '0', roleName: 'Manager' },
      { roleId: '1', roleName: 'Agent' },
    ];

    for (const role of roles) {
      const existingrole = await this.rolesRepository.findOneBy({
        roleId: role.roleId,
      });
      if (!existingrole) {
        await this.rolesRepository.save(role);
      }
    }
  }
}
