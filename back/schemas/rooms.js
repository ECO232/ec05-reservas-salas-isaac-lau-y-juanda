
const z = require('zod')

const roomSchema = z.object({
    name: z.string({
        invalid_type_error: 'room name must be a String',
        required_error: 'room name is required'
    }),
    id: z.number({
        invalid_type_error: 'room id must be a Number',
        required_error: 'room id is required'
    }).int().min(1),
    location: z.string({
        invalid_type_error: 'location must be a String',
        required_error: 'location is required'
    }).default("Unknown"),
})

function validateRoom(obj) {
    return roomSchema.safeParse(obj);
}

module.exports = {
    validateRoom
}