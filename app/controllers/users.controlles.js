 const { selectUsers } = require("../models/users.model")  



exports.getUsers = (req, res, next) =>{
    return selectUsers()
    .then((users)=>{
        
        
        res.status(200).send({users})
    })
    .catch(err =>{
        next(err)
    })
}
Rookswood135$
postgresql://postgres:[YOUR-PASSWORD]@db.zgkddvmwhphxgazyblzh.supabase.co:5432/postgres