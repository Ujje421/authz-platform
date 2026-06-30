import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';
import { User } from './user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createTenant(name: string): Promise<Tenant> {
    const tenant = this.tenantRepository.create({ name });
    return this.tenantRepository.save(tenant);
  }

  async createUser(email: string, passwordHash: string, tenantId: string): Promise<User> {
    const tenant = await this.tenantRepository.findOne({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const user = this.userRepository.create({
      email,
      password_hash: passwordHash,
      tenant_id: tenantId,
    });
    return this.userRepository.save(user);
  }
}
