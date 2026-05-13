'use server';

// Updated to include IMEI support
import { prisma } from './prisma';
import { getSession } from './actions';
import { revalidatePath } from 'next/cache';

export async function createIphone(formData: FormData) {
  const session = await getSession();
  if (session.role !== 'admin') throw new Error('Unauthorized');

  const model = formData.get('model') as string;
  const capacity = formData.get('capacity') as string;
  const imei = formData.get('imei') as string;
  const batteryStatus = formData.get('batteryStatus') as string;
  const batteryPercentage = formData.get('batteryPercentage') ? parseInt(formData.get('batteryPercentage') as string) : null;
  const price = parseFloat(formData.get('price') as string);
  const discountType = formData.get('discountType') as string;
  const observations = formData.get('observations') as string;
  const branchId = parseInt(formData.get('branchId') as string);

  await prisma.iphone.create({
    data: {
      model,
      capacity,
      imei,
      batteryStatus,
      batteryPercentage,
      price,
      discountType,
      observations,
      branchId,
    },
  });

  revalidatePath('/');
}

export async function updateIphone(id: number, formData: FormData) {
  const session = await getSession();
  if (session.role !== 'admin') throw new Error('Unauthorized');

  const model = formData.get('model') as string;
  const capacity = formData.get('capacity') as string;
  const imei = formData.get('imei') as string;
  const batteryStatus = formData.get('batteryStatus') as string;
  const batteryPercentage = formData.get('batteryPercentage') ? parseInt(formData.get('batteryPercentage') as string) : null;
  const price = parseFloat(formData.get('price') as string);
  const discountType = formData.get('discountType') as string;
  const observations = formData.get('observations') as string;
  const branchId = parseInt(formData.get('branchId') as string);

  await prisma.iphone.update({
    where: { id },
    data: {
      model,
      capacity,
      imei,
      batteryStatus,
      batteryPercentage,
      price,
      discountType,
      observations,
      branchId,
    },
  });

  revalidatePath('/');
}

export async function deleteIphone(id: number) {
  const session = await getSession();
  if (session.role !== 'admin') throw new Error('Unauthorized');

  await prisma.iphone.delete({
    where: { id },
  });

  revalidatePath('/');
}
