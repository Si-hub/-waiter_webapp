module.exports = function FactoryFunction(pool) {

    const getWaiter = async(name) => {
        const result = await pool.query('SELECT waiter_name FROM waiters WHERE waiter_name =$1', [name]);
        // return result.rows[0].id
        if (result.rowCount === 0) {
            await addWaiter(name);
        }
        let selectId = await pool.query('select id from waiters where waiter_name=$1', [name])
        return selectId.rows[0].id
    }

    // async function admin() {

    //     selected = await pool.query('select * from dayShifts where  waiters_name=$1 AND shift_days=$2 ', [enteredName])
    // }


    async function getDays() {
        let selectDay = await pool.query('select * from  weekdays')
        return selectDay.rows;
    }

    async function addShift(userId, dayId) {
        let nameId = await getWaiter(userId);

        for (const day of dayId) {
            let dayID = await weekDays(day)
            console.log(dayID)
            await pool.query('INSERT INTO dayShifts (waiter_id, day_id) VALUES ($1,$2) ', [nameId, dayID])
        }

    }

    // async function groupedUsers() {
    //     days = [
    //         { day: },

    //         {
    //             waiter:
    //         }
    //     ]


    // }

    // async function getDayId(id) {
    //     let getId = await pool.query('select * from dayShifts where id=$1', [id])
    //         // var dayId = getId.rows.length
    //     if (dayId > 0) {
    //         return true
    //     } else if (dayId === 0) {
    //         return false;
    //     }

    // }
    /* this function will help to avoid duplicate*/
    // async function addShiftWF(name, ids) {
    //     let user = await getWaiter(name);

    //     /*add username if he/she doesnt exist*/
    //     console.log(user.length)
    //     if (user.rowCount === 0) {
    //         await addWaiter(name);
    //         user = await getWaiter(name)
    //             // await days()

    //         /*add day shifts for each day */
    //         ids.forEach(async(id) => {
    //             await addShift(user.id, id)
    //         })


    //     }
    // };
    async function weekDays(day_id) {

        let insertDays = await pool.query('select id from  weekdays where day_name=$1', [day_id])
            // return insertDays.rows[0].id
        return insertDays.rows[0].id
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

    async function deleteShifts() {
        let clear = await pool.query('DELETE FROM dayShifts');
        return clear.rows;
    }
    // async function timeOut() {
    //     setTimeout( => (req, res, next) {
    //         document.querySelector(".pass").innerHTML = ""
    //     }, 1000)
    // }

    return {
        addWaiter,
        getCounter,
        deleteShifts,
        addShift,
        getDays,
        // addShiftWF,
        getWaiter,
        weekDays
    }

};