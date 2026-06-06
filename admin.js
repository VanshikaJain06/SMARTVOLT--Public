const res = require("express/lib/response");

class homepage{
    static async deleterequest(req, res, connection){
        var id=req.query.id
        try {
            await connection.execute('update Request set request_status = "deleted" where request_id = "${id}"')
            console.log("Request deleted successfully")
            return res.json({message: "Request deleted successfully"})
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error deleting request', error: err})
        }  
        }

    static async deletebookings(req, res, connection){
        var id= req.query.id
        try{
            await connection.execute('update Booking set booking_status = "deleted" where booking_id = "${id}"')
            console.log("Booking deleted successfully")
            return res.json({message: "Booking deleted successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: 'error deleting booking', error: err})
        }
        
    }
}

class EVSE{
    static async viewEVSE(req, res, connection){
        var id= req.query.id
        try{
            await connection.query('select * from EVSE where evse_id = "${id}"')
            console.log("EVSE details retrieved successfully")
            return res.json({message: "EVSE details retrieved successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: 'error retrieving EVSE details', error: err})
        }
    }
    static async addEVSE(req, res, connection){
        try{
            var EVSE_info = Object.values(req.body)
            await connection.query('insert into EVSE (evse_id, evse_name, evse_model, evse_company, evse_port1, evse_port2) values (?)', [EVSE_info])
            console.log("EVSE details added successfully")
            return res.json({message: 'EVSE details added successfully'})
        }
        catch(err){
            console.log(err);
            return res.json({message: 'Error adding EVSE details', error: err})
        }
    }

    static async updateEVSE(req, res, connection){
        try{
            var EVSE_info=Object.values(req.body)
            await connection.query('UPDATE EVSE Set evse_ID=?, evse_name=?, evse_model=?, evse_company=?, evse_port1=?, evse_port2=?', EVSE_info)
            console.log("EVSE details updated successfully")
            return res.json({message: "EVSE details updated successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "Error updating the EVSE details", error: err})
        }
    }

    static async deleteEVSE(req, res, connection){
        var id=req.query.id
        try{
            await connection.execute('delete from EVSE where evse_ID="${id}"')
            console.log("EVSE deleted successfully")
            return res.json({message: "EVSE deleted successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: 'error deleting the EVSE', error: err})
        }
    }
}

class EV{
    static async viewEV(req, res, connection){
        var id= req.query.id
        try{
            await connection.execute('select * from EV where ev_id = "${id}"')
            console.log("EV details retrieved successfully")
            return res.json({message: "EV details retrieved successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error retrieveing EV details", error: err})
        }
    }

    static async addEV(req, res, connection){
        try{
            var EV_info = Object.values(req.body)
            await connection.execute('insert into EV (ev_id, ev_name, ev_model, ev_company, bat_id, ev_type, ev_mileage, ev_port) values (?)', [EV_info])
            console.log("EV details added successfully")
            return res.json({message: "EV details added successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error adding EV details", error: err})
        }
    }

    static async updateEV(req, res, connection){
        try{
            var EV_info=Object.values(req.body)
            await connection.execute('update EV set ev_ID=?, ev_name=?, ev_model=?, ev_company=?, bat_ID=?, ev_type=?, ev_mileage=?, ev_port=?', EV_info)
            console.log("EV details updated successfully")
            return res.json({message: "EV details updated successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error updating EV details", error: err})
        }
    }

    static async deleteEV(req, res, connection){
        var id=req.query.id
        try{
            await connection.execute('delete from EV where ev_ID= "${id}"')
            console.log("EV Details deleted")
            return res.json({message: "EV Details deleted successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error deleting EV details", error: err})
        }
    }
}

class users{
    static async viewusers(req, res, connection){
        var id=req.query.id
        try{
            await connection.execute('select * from User where user_id="${id}"')
            console.log("User details retrieved successfully")
            return res.json({message: "User details retrieved successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error retrieving User details", error: err})
        }
    }

    static async adduser(req, res, connection){
        try{
            var user_info = Object.values(req.body)
            await connection.query('insert into Users (user_ID, user_firstname, user_lastname, user_phone, user_email, user_address, user_DOB, user_credits, user_license) values (?)', [user_info])
            console.log("User details added successfully")
            return res.json({message: "User details added successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error adding user details", error: err})
        }
    }

    static async updateusers(req, res, connection){
        try{
            var user_info = Object.values(req.body)
            await connection.query('update Users set user_ID=?, user_firstname=?, user_lastname=?, user_phone=?, user_email=?, user_address=?, user_DOB=?, user_credits=?, user_license=?', user_info)
            console.log("User details updated successfully")
            return res.json({message: "User details updated successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "Error updating user details", error: err})
        }
       
    }

    static async deleteuser(req, res, connection){
        var id=req.query.id 
        try{
            await connection.execute('delete from User where user_ID= "${id}"')
            console.log("User deleted successfully")
            return res.json({message: "User deleted successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error deleting User", error: err})
        }
        
    }
}

class Company{
    static async viewcompany(req, res, connection){
        var id=req.query.id
        try{
            await connection.execute('select * from Company where com_id="${id}"')
            console.log("Company details retrieved successfully")
            return res.json({message: "Company details retrieved successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error retrieving Company details", error: err})
        }
    }

    static async addcompany(req, res, connection){
        try{
            var com_info = Object.values(req.body)
            await connection.query('insert into Company (com_ID, com_name, com_phone, com_email, com_address, com_credits) values (?)', [com_info])
            console.log("Company details added successfully")
            return res.json({message: "Company details added successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error adding company details", error: err})
        }
    }

    static async updatecompany(req, res, connection){
        try{
            var com_info = Object.values(req.body)
            await connection.query('update Company set com_ID=?, com_name=?, com_phone=?, com_email=?, com_address=?, com_credits=?', com_info)
            console.log("Company details updated successfully")
            return res.json({message: "Company details updated successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "Error updating Company details", error: err})
        }
    }

    static async deletecompany(req, res, connection){
        var id=req.query.id 
        try{
            await connection.execute('delete from Company where com_id= "${id}"')
            console.log("Company deleted successfully")
            return res.json({message: "Company deleted successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error deleting Company", error: err})
        }
    }
}

class Reports{
    static async viewreports(req, res, connection){
        var id=req.query.id
        try{
            await connection.execute('select * from Reports where report_id="${id}"')
            console.log("Reports details retrieved successfully")
            return res.json({message: "Reports details retrieved successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error retrieving Reports details", error: err})
        }
    }

    static async resolvereports(req, res, connection){
        try{
            req.body.report_time = new Date().toJSON().slice(0, 19).replace('T', ' ')
            req.body.report_status = "resolved"
            var report_info = Object.values(req.body)
            await connection.execute('update Reports set report_id=?, report_from=?, report_time=?, report_status=?, report_description=?', report_info)
            console.log("Report resolved successfully")
            return res.json({message: "report resolved successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error resolving report", error: err})
        }
       
    }
}


module.exports = { EVSE, homepage, EV, users, Company, Reports }