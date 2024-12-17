class Controller {
  constructor(model) {
    this._model = model;
  }
  async _add(data) {
    try {
      if (typeof data === "object" && Object.keys(data).length > 0) {
        const entry = new this._model(data);
        const response = await entry.save();
        return response;
      } else {
        throw new Error("No data provided");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async _update(id, data) {
    try {
      if (typeof data === "object" && Object.keys(data).length > 0 && id) {
        const update_entry = await this._model.updateOne(
          { _id: id },
          {
            $set: data,
          }
        );
        if (update_entry.modifiedCount > 0) {
          return true;
        }
        return false;
      } else {
        throw new Error("No data provided");
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  async _delete(id) {
    try {
      if (id) {
        const delete_entry = await this._model.findByIdAndDelete(id);
        if (delete_entry) {
          return true;
        }
        return false;
      } else {
        throw new Error("No data provided");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async _find_all() {
    try {
      const entries = await this._model.find({});
      return entries;
    } catch (error) {
      console.log(error.message);
    }
  }

  async _find_by_query(query, excluded_fields = "-createdAt -updatedAt -__v") {
    try {
      if (query) {
        const entry = await this._model.findOne(query).select(excluded_fields);
        return entry;
      } else {
        throw new Error("No data provided");
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = Controller;
