module.exports = function FactoryFunction(pool) {

    const getWaiter = async(name) => {
        const result = await pool.query('SELECT waiter_name FROM waiters WHERE waiter_name =$1', [name]);
        return result.rows[0].waiter_name
    }

    // async function admin() {

    //     selected = await pool.query('select * from admin_checkin where  waiters_name=$1 AND shift_days=$2 ', [enteredName])
    // }


    async function addShift(userId, dayId) {
        await pool.query('INSERT INTO admin_checkin (waiter_id, day_id) VALUES ($1,$2) ', [userId, dayId])
    }

    /* this function will help to avoid duplicate*/
    async function addShiftWF(name, ids) {
        let user = await getWaiter(name);

        /*add username if he/she doesnt exist*/
        console.log(user.length)
        if (user.rowCount === 0) {
            await addWaiter(name);
            user = await getWaiter(name)
                // await days()

            /*add day shifts for each day */
            ids.forEach(async(id) => {
                await addShift(user.id, id)
            })


        }
    };
    async function weekDays(day_id) {
        let insertDays =
            await pool.query('select id from days_working where day_name=$1', [day_id])
            // return insertDays.rows[0].id
    }

    async function addWaiter(enteredName) {
        if (enteredName !== "") {
            await pool.query('insert into waiters (waiter_name) values ($1)', [enteredName])
            return true;
        } else {
            false
        }


    }

    async function getCounter() {
        const getname = await pool.query('select * from waiters')
        return getname.rowCount;
    }

    return {
        addWaiter,
        getCounter,
        // admin,
        addShift,
        addShiftWF,
        getWaiter,
        weekDays
    }

};