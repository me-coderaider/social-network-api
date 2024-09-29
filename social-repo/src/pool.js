const pg=require('pg');

// normally, we would create a pool like this:
/*
const pool=new pg.Pool({
    host:'localhost',
    port:5432
});
module.exports=pool;
*/
// Above, way of creating the pool makes it really
// difficult to connect to multiple different databases

// So, what we will do is, we'll is create a pool and 
// wrap it inside a class

class Pool{
    _pool=null;

    connect(options){
        this._pool=new pg.Pool(options);
    }
}
module.exports=new Pool();