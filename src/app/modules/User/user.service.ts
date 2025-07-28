import { Prisma, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../Shared/prisma";
import { paginationHelper } from "../../Shared/paginationHelper";
import { userSearchableFields } from "./user.constant";
import { TUser } from "../../utils/interface";
import { Request } from "express";

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

const getAllUsers = async (params: any, options: any) => {
  const { searchTerm, ...filterData } = params;
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const andCondition: Prisma.UserWhereInput[] = [];

  if (params?.searchTerm) {
    andCondition.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: params?.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  //   Search using specific Field

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      needsPasswordChanged: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      patient: true,
      doctor: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateUserStatus = async (id: string, status: UserRole) => {
  const isUserIsExists = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateData = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });
  return updateData;
};

const getMe = async (user: TUser) => {
  const userInfo = await prisma.user.findFirstOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      needsPasswordChanged: true,
      role: true,
      status: true,
    },
  });
  let profileInfo;

  if (userInfo.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  }
  return { ...userInfo, ...profileInfo };
};

const updateProfileInfo = async (user: TUser, req: Request) => {
  const userInfo = await prisma.user.findFirstOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const file = req.file;
  if (file) {
    req.body.profilePhoto = file?.path;
  }
  let profileInfo;

  if (userInfo.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  }
  return { ...profileInfo };
};

export const UserServices = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsers,
  updateUserStatus,
  getMe,
  updateProfileInfo,
};
