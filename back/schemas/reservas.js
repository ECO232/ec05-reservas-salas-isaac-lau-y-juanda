
const z = require('zod')

const reservaSchema = z.object({
    id_user: z.number({
        invalid_type_error: 'id_user name must be a Number',
        required_error: 'id_user is required'
    }).int().min(1),
    id_room: z.number({
        invalid_type_error: 'id_room must be a Number',
        required_error: 'id_room is required'
    }).int().min(1),
    hour: z.number({
        invalid_type_error: 'hour must be a Number',
        required_error: 'hour is required'
    }).int().min(1),
    id_user: z.number({
        invalid_type_error: 'id_user must be a Number',
        required_error: 'id_user is required'
    }).int().min(1),
})

function validateReserva(obj) {
    return reservaSchema.safeParse(obj);
}

module.exports = {
    validateReserva
}