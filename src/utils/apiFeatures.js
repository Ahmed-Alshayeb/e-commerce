class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  // pagination
  pagination() {
    let page = +this.queryString.page || 1;
    if (page < 1) page = 1;
    let limit = this.queryString.limit || 2;
    let skip = (page - 1) * limit;
    this.mongooseQuery.find().skip(skip).limit(limit);
    this.page = page;
    return this;
  }

  // filter
  filter() {
    let excludeQuery = ["page", "limit", "sort", "select", "search"];
    let filterQuery = { ...this.queryString };
    excludeQuery.forEach((el) => delete filterQuery[el]);
    filterQuery = JSON.parse(
      JSON.stringify(filterQuery).replace(/(gte|gt|lte|lt|eq)/, (match) => `$${match}`)
    );
    this.mongooseQuery.find(filterQuery);

    return this;
  }

  // sort
  sort() {
    if (this.queryString.sort) {
      this.mongooseQuery.sort(this.queryString.sort.replaceAll(",", " "));
    }
    return this;
  }

  // select
  select() {
    if (this.queryString.select) {
      this.mongooseQuery.select(this.queryString.select.replaceAll(",", " "));
    }
    return this;
  }

  // search
  search() {
    if (this.queryString.search) {
      this.mongooseQuery.find({
        $or: [
          {
            name: { $regex: this.queryString.search, $options: "i" },
            title: { $regex: this.queryString.search, $options: "i" },
            description: { $regex: this.queryString.search, $options: "i" },
          },
        ],
      });
    }

    return this;
  }
}

export default ApiFeatures;
