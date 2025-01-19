import { PrismaClient } from '@prisma/client';
import { measurePerformance } from '@/utils/performance';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  }).$extends({
    query: {
      async $allOperations({ operation, model, args, query }) {
        const end = measurePerformance(
          `Prisma Query: ${model}.${operation}`
        );
        const result = await query(args);
        end();
        return result;
      },
    },
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Query Utilities
export const withPagination = (page: number = 1, limit: number = 20) => ({
  skip: (page - 1) * limit,
  take: limit,
});

export const withSearch = (search: string, fields: string[]) => ({
  OR: fields.map((field) => ({
    [field]: { contains: search, mode: 'insensitive' },
  })),
});

export const withSort = (
  sortField: string,
  sortOrder: 'asc' | 'desc' = 'desc'
) => ({
  orderBy: {
    [sortField]: sortOrder,
  },
});

// Optimized query builders
export const createProductQuery = (options: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  const { page, limit, search, category, sortField, sortOrder } = options;

  return {
    ...withPagination(page, limit),
    ...(search && {
      where: {
        ...withSearch(search, ['name', 'description']),
        ...(category && { category }),
      },
    }),
    ...(sortField && withSort(sortField, sortOrder)),
  };
};