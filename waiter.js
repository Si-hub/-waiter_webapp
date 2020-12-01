module.exports = function FactoryFunction(pool) {

    const getWaiter = async(name) => {
        name = name.toUpperCase().charAt(0) + name.slice(1);
        const result = await pool.query('SELECT waiter_name FROM waiters WHERE waiter_name =$1', [name]);
        // return result.rows[0].id
        if (result.rowCount === 0) {
            await addWaiter(name);
        }
        let selectId = await pool.query('select id from waiters where waiter_name=$1', [name])
        return selectId.rows[0].id
    }

    async function getDays() {
        let selectDay = await pool.query('select * from  weekdays')
        return selectDay.rows;
    }

    async function addShift(userId, dayId) {
        let nameId = await getWaiter(userId);
        console.log(nameId);
        let stopDuplicate = await pool.query("DELETE FROM dayShifts where  waiter_id=$1", [nameId])
            // return stopDuplicate.rows

        for (const day of dayId) {
            let dayID = await weekDays(day)

            await pool.query('INSERT INTO dayShifts (waiter_id, day_id) VALUES ($1,$2) ', [nameId, dayID])
        }

    }
    async function allShifts() {
        let storedshifts = await pool.query(`SELECT waiters.waiter_name, weekdays.day_name FROM dayShifts 
        JOIN waiters ON waiters.id = dayShifts.waiter_id 
        JOIN weekdays ON weekdays.id = dayShifts.day_id;
                `)
        return storedshifts.rows
    }

    async function groupedShifts(name) {

        let storedShifts = await allShifts();

        let shiftsDays = await getDays()


        let array = []

        for (var i = 0; i < shiftsDays.length; i++) {
            const day = shiftsDays[i]
            let shiftObject = {
                dayArray: day.day_name,
                waiterName: []
            }
            array.push(shiftObject)
        }

        for (const data of array) {

            for (const list of storedShifts) {

                if (data.dayArray === list.day_name) {
                    data.waiterName.push(list.waiter_name)
                }
            }

        }

        array.forEach(element => {
            if (element.waiterName.length > 3) {
                element.days = "red"

            } else if (element.waiterName.length > 0 && element.waiterName.length < 3) {
                element.days = "orange"
            } else if (element.waiterName.length === 3) {
                element.days = "green"
            }
        });
        return array
    };
    /*help to avoid duplicate on waiters names*/
    async function daysForUserChecked(name) {
        const weekdays = await getWeekDays()
        const working = await checked(name)

        weekdays.forEach(week => {
            for (const workingDays of working) {
                if (week.day_name === workingDays.day_name) {
                    week.checked = "checked"
                }
            }
        })
        return weekdays
    }

    async function getWeekDays() {
        let onlyDays = await pool.query('select day_name from weekdays')
        return onlyDays.rows
    }

    async function checked(name) {
        let check = await pool.query(`SELECT weekdays.day_name FROM dayShifts 
        JOIN waiters ON waiters.id = dayShifts.waiter_id 
        JOIN weekdays ON weekdays.id = dayShifts.day_id where waiter_name=$1`, [name])
        return check.rows
    }

    async function weekDays(day_id) {

        let insertDays = await pool.query('select id from  weekdays where day_name=$1', [day_id])
            // return insertDays.rows[0].id
        return insertDays.rows[0].id
    }

    async function addWaiter(enteredName) {
        // enteredName = enteredName.toUpperCase().charAt(0) + enteredName.slice(1);
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


    return {
        checked,
        getWeekDays,
        allShifts,
        addWaiter,
        getCounter,
        deleteShifts,
        addShift,
        getDays,
        groupedShifts,
        getWaiter,
        weekDays,
        daysForUserChecked
    }

};