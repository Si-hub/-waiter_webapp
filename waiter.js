module.exports = function FactoryFunction(pool) {

    const getUser = async(name) => {
        const result = await pool.query('SELECT * FROM waiters WHERE waiter_name =$1', [name]);
        return result.rows[0]
    }

    async function admin() {

        selected = await pool.query('select * from admin_checkin where  waiters_name=$1 AND shift_days=$2 ', [enteredName])
    }


    async function addShift(userId, dayId) {
        await pool.query('INSERT INTO admin_checkin (waiter_id, day_id) VALUES ($1,$2) ', [userId, dayId])
    }

    /* this function will help to avoid duplicate*/
    async function addShiftWF(name, ids) {
        let user = await getUser(name);

        /*add username if he/she doesnt exist*/
        if (user.length === 0) {
            await addUser(name);
            user = await getUser(name)

            /*add day shifts for each user */
            ids.forEach(async(id) => {
                await addShift(user.id, id)
            })


        }
    };

    async function addUser(enteredName) {

        await pool.query('insert into waiters (waiter_name) values ($1)', [enteredName])
    }

    async function getCounter() {
        const getname = await pool.query('select * from waiters')
        return getname.rowCount;
    }

    return {
        addUser,
        getCounter,
        admin,
        addShift,
        addShiftWF,
        getUser
    }

};