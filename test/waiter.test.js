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

    it('should add all the week days', async function() {

        // the Factory Function is called regFactoryFunction
        const FactoryFunction = Waiters(pool);

        await FactoryFunction.weekDays()

        assert.deepEqual(await FactoryFunction.addShiftWF(), [{
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
            }
        ]);


    })

    it('should adds and returns the waiters shifts', async function() {

        // the Factory Function is called regFactoryFunction
        const FactoryFunction = Waiters(pool);

        await FactoryFunction.addShiftWF()

        assert.deepEqual(await FactoryFunction.addShift());
    });

    after(function() {
        pool.end();
    });
});