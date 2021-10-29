import db from "../../../../../shared/infra/knex/connections";

class NotificationRepository {
    constructor() { }
    async create({
        TIME,
        VALUE,
        NAME,
        UNIT,
        ID_SENSOR,
        EMAIL,
        NOTE,
        MEDITION_TYPE,
        CONDITION,
        POSITION,
    }) {
        await db('notifications').insert(
            {
                // TIME: TIME * 1,
                TIME: TIME * 60,
                VALUE,
                NAME,
                UNIT,
                ID_SENSOR,
                EMAIL,
                NOTE,
                MEDITION_TYPE,
                CONDITION,
                POSITION,
            }
        )

    }
    async show() {
        const notifications = await db('notifications')
        return notifications

    }
    async findById(id) {
        const notifications = await db('notifications')
            .where({ id })
        return notifications

    }
    async deleteById(id) {
        await db('notifications')
            .where({ id })
            .delete()
    }
    async put({
        ID,
        TIME,
        VALUE,
        NAME,
        UNIT,
        ID_SENSOR,
        EMAIL,
        NOTE,
        MEDITION_TYPE,
        CONDITION,
        POSITION,
    }) {
        await db('notifications')
            .where({ id: ID })
            .update({
                TIME: TIME * 60,
                VALUE,
                UNIT,
                NAME,
                ID_SENSOR,
                EMAIL,
                NOTE,
                MEDITION_TYPE,
                CONDITION,
                POSITION,
            })
    }
}

export { NotificationRepository }