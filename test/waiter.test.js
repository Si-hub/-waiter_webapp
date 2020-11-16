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
        await pool.query("delete from waiters;");

    });

    it('should add names of waiters to the database', async function() {

        // the Factory Function is called regFactoryFunction
        const FactoryFunction = Waiters(pool);


        await FactoryFunction.addUser('John')
        await FactoryFunction.addUser('Sim')
        await FactoryFunction.addUser('Buja')
            // await FactoryFunction.addUser(undefined)
            // await FactoryFunction.addUser(11233)
            // await FactoryFunction.addUser(null)

        assert.equal(3, await FactoryFunction.getCounter())


    })

    it('should not add duplicate for shifts', async function() {

        // the Factory Function is called regFactoryFunction
        const FactoryFunction = Waiters(pool);

        await FactoryFunction.addUser('John')
        await FactoryFunction.addUser('John')
        await FactoryFunction.addUser('John')

        assert.equal(1, await FactoryFunction.addShiftWF())


    })

    after(function() {
        pool.end();
    });
});