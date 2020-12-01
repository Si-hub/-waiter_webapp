const assert = require('assert');
const Waiters = require('../waiter');
const pg = require("pg");
const Pool = pg.Pool;

// we are using a special test database for the tests
const connectionString = process.env.DATABASE_URL || 'postgresql://sim:pg123@localhost:5432/coffeeshop_tests';

const pool = new Pool({
    connectionString
});

describe('The waiters-Availability function', function() {


    beforeEach(async function() {
        // clean the tables before each test run
        await pool.query("delete from admin_checkin;");
        await pool.query("delete from waiters;");
        await pool.query("delete from days_working;;");

    });

    it('should add names of waiters to the database', async function() {

        // the Factory Function is called regFactoryFunction
        const FactoryFunction = Waiters(pool);


        await FactoryFunction.addWaiter('John')
        await FactoryFunction.addWaiter('Sim')
        await FactoryFunction.addWaiter('Buja')


        assert.equal(3, await FactoryFunction.getCounter())


    })

    it('should return all the week days', async function() {

        // the Factory Function is called regFactoryFunction
        const FactoryFunction = Waiters(pool);

        assert.deepEqual(await FactoryFunction.getDays(), [{
                day_name: 'Monday'
            },
            {
                day_name: 'Tuesday'
            },
            {
                day_name: 'Wednesday'
            },
            {
                day_name: 'Thursday'
            },
            {
                day_name: 'Friday'
            }, {
                day_name: 'Saturday'
            }, {
                day_name: 'Sunday'
            }
        ]);


    })

    it('should allow a user to add shift', async function() {

        // the Factory Function is called regFactoryFunction
        const FactoryFunction = Waiters(pool);
        await FactoryFunction.weekDays()
        await FactoryFunction.addWaiter('simthera', 'Monday', 'Tuesday', 'Friday ')
        let shiftObject = {
            waiterName: 'simthera',
            dayArray: ['Monday',
                'Tuesday',
                'Friday'
            ]

        }
        assert.deepEqual();
    });

    it('should get all weekdays with checked days as specified user', async function() {

        // the Factory Function is called regFactoryFunction
        const FactoryFunction = Waiters(pool);
        let shiftObject = {
            waiterName: 'sipho',
            dayArray: ['Monday',
                'Tuesday',
                'Thursday'
            ]

        }
        await FactoryFunction.addWaiter(shiftObject)

        assert.deepEqual(await FactoryFunction.getWeekDays(), [{
                day_name: 'Monday',
                checked: true
            },
            {
                day_name: 'Tuesday',
                checked: true
            },
            {
                day_name: 'Wednesday'
            },
            {
                day_name: 'Thursday',
                checked: true
            },
            {
                day_name: 'Friday'
            }, {
                day_name: 'Saturday'
            }, {
                day_name: 'Sunday'
            }
        ]);


    })

    it('shift must be waiterName and a days', async function() {

        // the Factory Function is called regFactoryFunction
        const FactoryFunction = Waiters(pool);
        await FactoryFunction.addShift()

        let shiftObject = {
            waiterName: 'Ovayo',
            dayArray: ['Saturday',
                'Sunday',
                'Monday'
            ]

        }
        assert.deepEqual(await FactoryFunction.allShifts(), [{
            waiterName: 'Ovayo',
            dayArray: ['Saturday']
        }, {
            waiterName: 'Ovayo',
            dayArray: ['Sunday']
        }, {
            waiterName: 'Ovayo',
            dayArray: ['Monday']
        }]);
    });
});

describe('it must not add duplicate of a user or waiter', function() {
    it('shouls clear all shifts', async function() {
        const FactoryFunction = Waiters(pool);

        await FactoryFunction.addWaiter('sim')
        await FactoryFunction.addWaiter('sim')

        assert.deepEqual(1, await FactoryFunction.daysForUserChecked('sim'))
    })
})

describe('clear function for shifts', function() {
    it('should clear all shifts', async function() {
        const FactoryFunction = Waiters(pool);

        assert.deepEqual(await FactoryFunction.deleteShifts(), [])
    })
})
after(function() {
    pool.end();
});