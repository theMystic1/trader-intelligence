import { Model, Document, Query } from "mongoose";

class APIFeatures<T extends Document> {
  query: Query<T[], T>;
  queryString: Record<string, any>;

  // cached filter used for pagination metadata
  filterObj: Record<string, any> = {};

  constructor(query: Query<T[], T>, queryString: Record<string, any>) {
    this.query = query;
    this.queryString = queryString;
  }

  // -----------------------------
  // FILTER
  // -----------------------------
  filter() {
    const queryObj: Record<string, any> = { ...this.queryString };

    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((field) => delete queryObj[field]);

    // convert operators: gte, gt, lte, lt → $gte etc.
    Object.keys(queryObj).forEach((key) => {
      const value = queryObj[key];

      if (typeof value === "string") {
        queryObj[key] = value.replace(
          /\b(gte|gt|lte|lt)\b/g,
          (match) => `$${match}`,
        );
      }

      // handle nested objects safely if needed
      if (typeof value === "object" && value !== null) {
        queryObj[key] = JSON.parse(JSON.stringify(value));
      }
    });

    this.filterObj = queryObj;
    this.query = this.query.find(this.filterObj);

    return this;
  }

  // -----------------------------
  // SORT
  // -----------------------------
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  // -----------------------------
  // FIELD LIMITING
  // -----------------------------
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  // -----------------------------
  // PAGINATION
  // -----------------------------
  paginate() {
    const page = Math.max(1, Number(this.queryString.page) || 1);
    const limit = Math.max(1, Number(this.queryString.limit) || 10);

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  // -----------------------------
  // PAGINATION META
  // -----------------------------
  async getPaginationMeta(Model: Model<T>) {
    const curPage = Math.max(1, Number(this.queryString.page) || 1);
    const limit = Math.max(1, Number(this.queryString.limit) || 10);

    const total = await Model.countDocuments(this.filterObj);

    const lastPage = Math.max(1, Math.ceil(total / limit));

    return {
      total,
      limit,
      curPage,
      lastPage,
      hasNext: curPage < lastPage,
      hasPrev: curPage > 1,
    };
  }
}

export default APIFeatures;
