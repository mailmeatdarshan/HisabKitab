const { getRedisClient } = require("../config/redis-client-config");
const { ExpanseRepository } = require("../repositories");
const AppError = require("../utils/errors/app-errors");
const { StatusCodes } = require("http-status-codes");
const expanseRepo = new ExpanseRepository();

async function addExpanse(data) {
  try {
    const exp = await expanseRepo.create(data);
    const dateFormat = exp.Date;
    const month = dateFormat.toISOString().slice(0, 7);
    const key = `summary:${data.userId}:${month}`;

    const redisClient = getRedisClient();
    if (redisClient) {
      const cache = await redisClient.get(key);
      if (cache) {
        await redisClient.del(key);
      }
    }

    return exp;
  } catch (error) {
    console.log(error);
    throw new AppError(
      "Something went wrong in the addExpanse service",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getExpanses(userId) {
  try {
    const exp = await expanseRepo.getAllByUser(userId);
    return exp;
  } catch (error) {
    console.log(error);
    throw new AppError(
      "Something went wrong in the getExpanses service",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function filterBy(query) {
  try {
    const filter = {};
    if (query.category) {
      filter.category = query.category;
    }
    if (query.Date) {
      filter.Date = new Date(query.Date);
    }
    if (query.userId) {
      filter.userId = query.userId;
    }
    const exp = await expanseRepo.getFilterBy(filter);
    return exp;
  } catch (error) {
    console.log(error);
    throw new AppError(
      "Something went wrong in the filterByCategory service",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function deleteExpanse(id, userId) {
  try {
    const result = await expanseRepo.deleteById(id, userId);
    if (!result) {
      throw new AppError(
        "Expense not found or unauthorized",
        StatusCodes.NOT_FOUND
      );
    }

    // Invalidate cache for the month of the deleted expense
    const redisClient = getRedisClient();
    if (redisClient && result.Date) {
      const month = result.Date.toISOString().slice(0, 7);
      const key = `summary:${userId}:${month}`;
      await redisClient.del(key);
    }

    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.log(error);
    throw new AppError(
      "Something went wrong in the deleteExpanse service",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function updateExpanse(id, userId, data) {
  try {
    const result = await expanseRepo.updateById(id, userId, data);
    if (!result) {
      throw new AppError(
        "Expense not found or unauthorized",
        StatusCodes.NOT_FOUND
      );
    }

    // Invalidate cache for the month of the updated expense
    const redisClient = getRedisClient();
    if (redisClient && result.Date) {
      const month = result.Date.toISOString().slice(0, 7);
      const key = `summary:${userId}:${month}`;
      await redisClient.del(key);
    }

    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.log(error);
    throw new AppError(
      "Something went wrong in the updateExpanse service",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getTotalExpanses(data) {
  try {
    const monthKey = data.month ? data.month.slice(0, 7) : "";
    const key = `summary:${data.userId}:${monthKey}`;

    const redisClient = getRedisClient();
    if (redisClient) {
      const cache = await redisClient.get(key);
      if (cache) {
        return JSON.parse(cache);
      }
    }

    const results = await expanseRepo.getTotalSummary({
      ...data,
      month: monthKey,
    });

    if (redisClient) {
      await redisClient.set(key, JSON.stringify(results));
    }

    return results;
  } catch (error) {
    console.log(error);
    throw new AppError(
      "Something went wrong in the getTotalExpanses service",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  addExpanse,
  getExpanses,
  filterBy,
  deleteExpanse,
  updateExpanse,
  getTotalExpanses,
};
