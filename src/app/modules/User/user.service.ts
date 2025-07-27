import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../Shared/prisma";

const createAdmin = async (payload: any, file: any) => {
  const hashPassword = await bcrypt.hash(payload?.password, 12);

  const userData = {
    email: payload?.admin.email,
    password: hashPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    payload.admin.profilePhoto = file?.path;
    const createAdmin = await transactionClient.admin.create({
      data: payload?.admin,
    });

    return createAdmin;
  });

  return result;
};
const createDoctor = async (payload: any, file: any) => {
  const hashPassword = await bcrypt.hash(payload?.password, 12);

  const userData = {
    email: payload?.doctor?.email,
    password: hashPassword,
    role: UserRole.DOCTOR,
  };

  const doctorData = {
    ...payload?.doctor,
    profilePhoto: file?.path,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createDoctor = await transactionClient.doctor.create({
      data: doctorData,
    });

    return createDoctor;
  });

  return result;
};
const createPatient = async (payload: any, file: any) => {
  const hashPassword = await bcrypt.hash(payload?.password, 12);

  const userData = {
    email: payload?.patient?.email,
    password: hashPassword,
    role: UserRole.PATIENT,
  };

  const patientData = {
    ...payload?.patient,
    profilePhoto: file?.path,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createPatient = await transactionClient.patient.create({
      data: patientData,
    });

    return createPatient;
  });

  return result;
};

export const UserServices = {
  createAdmin,
  createDoctor,
  createPatient,
};
