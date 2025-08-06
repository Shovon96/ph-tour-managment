import { model, Schema } from "mongoose"
import { IDivision } from "./division.interface"

const divisionSchema = new Schema<IDivision>({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String },
    desciption: { type: String }
}, {
    timestamps: true
})


divisionSchema.pre("save", async function (next) {
    if (this.isModified("name")) {
        const baseSlug = this.name.toLowerCase().split(" ").join("-")
        let slug = `${baseSlug}-division`

        let counter = 1
        while (await Division.exists({ slug })) {
            slug = `${slug}-${counter++}`
        }

        this.slug = slug
        console.log('slug from divion model', slug)
    }
    next()
})

divisionSchema.pre("findOneAndUpdate", async function (next) {
    const division = this.getUpdate() as Partial<IDivision>
    if (division.name) {
        let slug = division.name.toLowerCase().split(" ").join("-")
        
        let counter = 1
        while (await Division.exists({ slug })) {
            slug = `${slug}-${counter++}`
        }
        
        division.slug = slug
    }
    
    this.setUpdate(division)
    next()
})


export const Division = model<IDivision>("Division", divisionSchema)