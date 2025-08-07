import { Query } from "mongoose";

export class QueryBuilder<T> {
    public modelQuery: Query<T[], T>
    public readonly query: Record<string, string>

    constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
        this.modelQuery = modelQuery
        this.query = query
    }

    filter(): this {
        const filter = { ...this.query }

        const excludedFields = ["searchTerm", "fields", "sort", "limit", "page"]
        for (const field of excludedFields) {
            delete filter[field]
        }

        this.modelQuery = this.modelQuery.find(filter)
        return this;
    }

    search(searchableField: string[]): this {
        const searchTerm = this.query.searchTerm || ""

        const searchQuery = {
            $or: searchableField.map(field => ({ [field]: { $regex: searchTerm, $options: 'i' } }))
        }

        this.modelQuery = this.modelQuery.find(searchQuery)

        return this;
    }


}