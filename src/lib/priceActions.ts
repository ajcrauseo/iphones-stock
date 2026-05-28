'use server';

import { prisma } from './prisma';
import { getSession } from './actions';
import { revalidatePath } from 'next/cache';

export async function createCatalogPrice(formData: FormData) {
  const session = await getSession();
  if (session.role !== 'admin') throw new Error('Unauthorized');

  const model = formData.get('model') as string;
  const capacity = formData.get('capacity') as string;
  let color = formData.get('color') as string | null;
  const price = parseFloat(formData.get('price') as string);
  const updateStock = formData.get('updateStock') === 'true';

  // Normalize: use empty string for "all colors" to avoid NULL duplicates in unique constraint
  if (!color || color.trim() === '' || color === 'ALL') {
    color = '';
  }

  // Create or update catalog price (upsert on unique model+capacity+color)
  await prisma.catalogPrice.upsert({
    where: {
      model_capacity_color: {
        model,
        capacity,
        color,
      }
    },
    update: {
      price,
    },
    create: {
      model,
      capacity,
      color,
      price,
    }
  });

  if (updateStock) {
    const whereClause: any = {
      model,
      capacity,
    };
    if (color) {
      whereClause.color = color;
    }

    await prisma.iphone.updateMany({
      where: whereClause,
      data: {
        price,
      }
    });
  }

  revalidatePath('/prices');
  revalidatePath('/');
}

export async function deleteCatalogPrice(id: number) {
  const session = await getSession();
  if (session.role !== 'admin') throw new Error('Unauthorized');

  await prisma.catalogPrice.delete({
    where: { id },
  });

  revalidatePath('/prices');
}
