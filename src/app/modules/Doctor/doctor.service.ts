import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { adminSearchableFields } from "../Admin/admin.constant";
import { doctorSearchableFields } from "./doctor.constant";
import { paginationHelper } from "../../Shared/paginationHelper";
import prisma from "../../Shared/prisma";

const getAllDoctor = async (filters: any, options: any) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, specialties, ...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // doctor > doctorSpecialties > specialties -> title

  if (specialties && specialties.length > 0) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const total = await prisma.doctor.count({
    where: whereConditions,
  });

  const doctors = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { averageRating: "desc" },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
      // review: {
      //   select: {
      //     rating: true,
      //   },
      // },
    },
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: doctors,
  };
};

const getSingleDoctor = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};
const deleteDoctor = async (id: string): Promise<Doctor | null> => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const doctorDeletedData = await transactionClient.doctor.delete({
      where: {
        id,
      },
    });
    await transactionClient.user.delete({
      where: {
        email: doctorDeletedData?.email,
      },
    });

    return doctorDeletedData;
  });
  return result;
};

const updatedDoctorData = async (id: string, payload: any) => {
  const { specialties, ...doctorData } = payload;

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: { id },
  });

  await prisma.$transaction(async (transitionClient) => {
    // Update doctor basic data
    await transitionClient.doctor.update({
      where: { id },
      data: doctorData,
    });

    if (specialties && specialties.length > 0) {
      // Delete specialties in one query
      const deleteSpecialtiesIds = specialties
        .filter((s: any) => s.isDeleted)
        .map((s: any) => s.specialtiesId);

      if (deleteSpecialtiesIds.length > 0) {
        await transitionClient.doctorSpecialties.deleteMany({
          where: {
            doctorId: doctorInfo.id,
            specialtiesId: { in: deleteSpecialtiesIds },
          },
        });
      }

      // Create specialties in one query
      const createSpecialties = specialties.filter((s: any) => !s.isDeleted);

      if (createSpecialties.length > 0) {
        await transitionClient.doctorSpecialties.createMany({
          data: createSpecialties.map((s: any) => ({
            doctorId: doctorInfo.id,
            specialtiesId: s.specialtiesId,
          })),
          skipDuplicates: true,
        });
      }
    }
  });

  return prisma.doctor.findUnique({
    where: { id: doctorInfo.id },
    include: {
      doctorSpecialties: {
        include: { specialties: true },
      },
    },
  });
};

export const DoctorServices = {
  getAllDoctor,
  getSingleDoctor,
  deleteDoctor,
  updatedDoctorData,
};
