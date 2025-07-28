import { Request } from "express";
import prisma from "../../Shared/prisma";

const createSpecialtiesIntoDb = async (req: Request) => {
  const file = req.file;

  if (file) {
    req.body.icon = file?.path;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });
  return result;
};

const getAllSpecialties = async () => {
  const result = await prisma.specialties.findMany();
  return result;
};
const deleteSpecialtiesFromDB = async (id: string) => {
  const isUserIsExists = await prisma.specialties.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.specialties.delete({
    where: {
      id,
    },
  });
  return result;
};

export const SpecialtiesServices = {
  createSpecialtiesIntoDb,
  getAllSpecialties,
  deleteSpecialtiesFromDB,
};
