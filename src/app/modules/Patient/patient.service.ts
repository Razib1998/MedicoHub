import { Patient, Prisma } from "@prisma/client";
import { paginationHelper } from "../../Shared/paginationHelper";
import prisma from "../../Shared/prisma";
import { patientSearchableFields } from "./patient.constant";

const getAllPatient = async (filters: any, options: any) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.PatientWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: patientSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
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

  const whereConditions: Prisma.PatientWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const patients = await prisma.patient.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });
  const total = await prisma.patient.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      total,
      limit,
    },
    data: patients,
  };
};

const getSinglePatient = async (id: string): Promise<Patient | null> => {
  const result = await prisma.patient.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updatePatientData = async (id: string, payload: any) => {
  const { patientHealthData, medicalReport, ...patientData } = payload;
  console.log(patientHealthData, medicalReport);
  const isPatientExists = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transitionClient) => {
    const updatedPatientInfo = await prisma.patient.update({
      where: {
        id,
      },
      data: patientData,
      include: {
        patientHealthData: true,
        medicalReport: true,
      },
    });

    // Create or update patientHealth data

    if (patientHealthData) {
      const healthData = await prisma.patientHealthData.upsert({
        where: {
          patientId: isPatientExists.id,
        },
        update: patientHealthData,
        create: { patientId: isPatientExists.id, ...patientHealthData },
      });
    }

    // Create Medical Report

    if (medicalReport) {
      const report = await prisma.medicalReport.create({
        data: { patientId: isPatientExists.id, ...medicalReport },
      });
    }
  });

  const responseData = await prisma.patient.findUnique({
    where: {
      id: isPatientExists.id,
    },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });

  return responseData;
};
export const PatientServices = {
  getAllPatient,
  getSinglePatient,
  updatePatientData,
};
