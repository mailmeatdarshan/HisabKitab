const redisClient = require("../config/redis-client-config");
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
    const cache = await redisClient.get(key);
    if (cache) {
        await redisClient.del(key);
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

async function getExpanses() {
  try {
    const exp = await expanseRepo.getAll();
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

async function getTotalExpanses(data) {
  try {
    const monthKey = data.month ? data.month.slice(0, 7) : "";
    const key = `summary:${data.userId}:${monthKey}`;
    const cache = await redisClient.get(key);
    if (cache) {
      return JSON.parse(cache);
    } else {
      const results = await expanseRepo.getTotalSummary({
        ...data,
        month: monthKey,
      });
      await redisClient.set(key, JSON.stringify(results));
      return results;
    }
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
  getTotalExpanses,
};
