import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CheckParams } from './graph.service';

@Injectable()
export class PermissionCacheService {
  // L1 In-memory cache (Local to this node instance)
  private localCache: Map<string, { value: boolean; expiresAt: number }> = new Map();
  private L1_TTL_MS = 5000; // 5 seconds local cache

  constructor(@Inject(CACHE_MANAGER) private redisCache: Cache) {}

  private generateKey(params: CheckParams): string {
    return `check:${params.tenantId}:${params.resourceNamespace}:${params.resourceId}:${params.relation}:${params.subjectNamespace}:${params.subjectId}:${params.subjectRelation || ''}`;
  }

  async get(params: CheckParams): Promise<boolean | null> {
    const key = this.generateKey(params);
    
    // Check L1 (Local Memory)
    const local = this.localCache.get(key);
    if (local && local.expiresAt > Date.now()) {
      return local.value;
    }

    // Check L2 (Redis)
    const redisResult = await this.redisCache.get<boolean>(key);
    if (redisResult !== undefined && redisResult !== null) {
      // Backfill L1
      this.localCache.set(key, { value: redisResult, expiresAt: Date.now() + this.L1_TTL_MS });
      return redisResult;
    }

    return null;
  }

  async set(params: CheckParams, result: boolean): Promise<void> {
    const key = this.generateKey(params);
    
    // Set L1
    this.localCache.set(key, { value: result, expiresAt: Date.now() + this.L1_TTL_MS });
    
    // Set L2 with 1 minute TTL
    await this.redisCache.set(key, result, 60000);
  }

  async invalidate(tenantId: string, resourceNamespace: string, resourceId: string): Promise<void> {
    this.localCache.clear(); 
    // Need to use Redis client to scan and delete keys matching the pattern in L2
  }
}
