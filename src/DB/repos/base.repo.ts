import mongoose, { FilterQuery, Model, PopulateOptions, SortOrder } from "mongoose";
// find options
interface findOptions<T> {
    filter: FilterQuery<T>;
    select?: string;
    populate?: PopulateOptions[];
}
// find many options
interface findManyOptions<T> {
    filter?: FilterQuery<T>;
    select?: string;
    populate?: PopulateOptions[];
    sort?: {[key : string] : SortOrder};
    limit?: number;
    skip?: number;
}
// update options
interface updateOptions<T> {
    filter: FilterQuery<T>;
    update: Partial<T>;
}
// delete options
interface deleteOptions<T> {
    filter?: FilterQuery<T>;
}


// findById options
interface findByIdOptions{
    _id: mongoose.Schema.Types.ObjectId ;
    select?: string;
    populate?: PopulateOptions[];
}

// findByIdAndUpdate options
interface findByIdAndUpdateOptions<T> {
    _id: mongoose.Schema.Types.ObjectId ;
    update: Partial<T>;
}

export class BaseRepo<T> {
    constructor(private readonly model: Model<T>) {}

    // create
    async create(data: Partial<T>):Promise<T> {
        return await this.model.create(data);
        
    }

    // findOne
    async findOne({filter, select = '', populate = []}: findOptions<T>):Promise<T | null> {
        return await this.model.findOne(filter).select(select).populate(populate);
    }

    // findAll
    async findAll({filter={}, select = '', populate = [] , sort , limit = 10 , skip }: findManyOptions<T>):Promise<T[]> {
        const query = this.model.find(filter).select(select).populate(populate);
        if(sort) {
            query.sort(sort);
        }
        if(limit) {
            if(typeof limit !== 'number' ) {
                limit = parseInt(limit as unknown as string);
            }
            if(skip) {
                if(typeof skip !== 'number' ) {
                    skip = parseInt(skip as unknown as string);
                }
                if(skip < 1) {
                    skip = 0;
                }
                query.skip(skip);
            }
            if(limit < 1) {
                limit = 1;
            }
            query.limit(limit);
        }
        return await query.exec();
    }

    // updateOne
    async updateOne({filter, update}: updateOptions<T>):Promise<T | null> {
        return await this.model.findOneAndUpdate(filter, update, {new: true});
    }

    // findById
    async findById({_id, select = '', populate = []}: findByIdOptions):Promise<T | null> {
        return await this.model.findById(_id).select(select).populate(populate);
    }

    // findByIdAndUpdate
    async findByIdAndUpdate({_id, update}: findByIdAndUpdateOptions<T>):Promise<T | null> {
        return await this.model.findByIdAndUpdate(_id, update, {new: true});
    }

    // delete eOne By Id
    async deleteById({_id}: findByIdOptions):Promise<T | null> {
        return await this.model.findByIdAndDelete(_id);
    }

    // delete One By Filter
    async deleteOne({filter}: deleteOptions<T>):Promise<T | null> {
        return await this.model.findOneAndDelete(filter);
    }

}