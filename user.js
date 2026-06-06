class UserEV{
    static async viewUserEV(req, res, connection){
        var id= req.query.id
        try{
            await connection.execute('select * from UserEV where user_ev_id = "${id}"')
            console.log("User EV details retrieved successfully")
            return res.json({message: "User EV details retrieved successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error retrieveing User EV details", error: err})
        }
    }

    static async addUserEV(req, res, connection){
        try{
            var UserEV_info = Object.values(req.body)
            await connection.execute('insert into UserEV (user_ev_id, user_id, ev_id, registration_no, purchase_date) values (?)', [UserEV_info])
            console.log(" User EV details added successfully")
            return res.json({message: "User EV details added successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error adding User EV details", error: err})
        }
    }

    static async updateUserEV(req, res, connection){
        try{
            req.body.purchase_date = new Date().toJSON().slice(0,19).replace('T', ' ')
            var UserEV_info=Object.values(req.body)
            await connection.execute('update EV set user_ev_id=?, user_id=?, ev_id=?, registration_no=?, purchase_date=?', UserEV_info)
            console.log("User EV details updated successfully")
            return res.json({message: "User EV details updated successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error updating user EV details", error: err})
        }
    }

    static async deleteUserEV(req, res, connection){
        var id=req.query.id
        try{
            await connection.execute('delete from UserEV where user_ev_ID= "${id}"')
            console.log("User EV Details deleted")
            return res.json({message: "User EV Details deleted successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error deleting User EV details", error: err})
        }
    }
}

class UserEVBattery{
    static async viewUserEVBattery(req, res, connection){
        var id= req.query.id
        try{
            await connection.execute('select * from UserEVBattery where user_ev_bat_id = "${id}"')
            console.log("User EV Battery details retrieved successfully")
            return res.json({message: "User EV Battery details retrieved successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error retrieveing User EV Battery details", error: err})
        }
    }
}

module.exports = { UserEV, UserEVBattery }