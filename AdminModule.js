
class AdminGrid{
    static async adminAllRequests(req, res, connection){
        try{
            var data = await connection.execute(`select * from Request`)
            var payload = {data: [data[0]]}

            data = await connection.execute(`select com_id, com_name from company`)
            payload.data[1] = data[0]
            data = await connection.execute(`select station_id, station_location from station`)
            payload.data[2] = data[0]
            console.log('requests retrieved successfully')
            return res.json(payload.data)
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error retrieving requests', error: err})
        }
    }

    static async adminDeleteRequest(req, res, connection){
        var id = req.body.id
        try{
            if(req.body.status == 'accepted'){
                await connection.execute(`delete from RequestResolve where request_id = "${id}"`)
            }
            await connection.execute(`update request set request_status = "canceled" where request_id = "${id}"`)
            console.log("request cancelled successfully")
            return res.json({message: "request cancelled successfully"})
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error cancelling request', error: err})
        }
    }
}

class AdminUser{
    //fetch all users
    static async allUsers(req, res, connection){
        try{
            var data = await connection.execute('select * from User')
            var payload = {data: data[0]}
            console.log("All users retrieved successfully")
            return res.json(payload.data)
        }
        catch(err){
            console.log(err);
            return res.json({message: "error retrieving all users", error: err})
        }
    }

    //fetch specific user
    static async user(req, res, connection){
        var id = req.query.id
        try{
            var data = await connection.execute(`select * from User where user_id = "${id}"`)
            var payload = {data: data[0]}
            console.log("User retrieved successfully")
            return res.json(payload.data)
        }
        catch(err){
            console.log(err);
            return res.json({message: "error retrieving user", error: err})
        }
    }

    static async addUser(req, res, connection){
        var user_info = Object.values(req.body)
        try{
            await connection.query('insert into User (user_firstname, user_lastname, user_phone, user_email, user_address, user_DOB, user_credits, user_license) values (?)', [user_info])
            console.log("User added successfully")
            return res.json({message: "User added successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error adding user", error: err})
        }
    }

    static async updateUser(req, res, connection){
        try{
            var user_info = Object.values(req.body)
            await connection.query('update User set user_firstname=?, user_lastname=?, user_phone=?, user_email=?, user_address=?, user_DOB=?, user_credits=?, user_license=? where user_id=?', user_info)
            console.log("User updated successfully")
            return res.json({message: "User updated successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error updating user", error: err})
        }
    }

    static async deleteUser(req, res, connection){
        var id = req.body.id
        try{
            await connection.execute(`delete from User where user_ID= "${id}"`)
            console.log("User deleted successfully")
            return res.json({message: "User deleted successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error deleting user", error: err})
        }
    }
}

class AdminCompany{
    //fetch all companies
    static async allCompanies(req, res, connection){
        try{
            var data = await connection.execute('select * from company')
            var payload = {data: data[0]}
            console.log("All companies retrieved successfully")
            return res.json(payload.data)
        }
        catch(err){
            console.log(err);
            return res.json({message: "error retrieving all companies", error: err})
        }
    }

    //fetch specific company
    static async company(req, res, connection){
        var id = req.query.id
        try{
            var data = await connection.execute(`select * from company where com_id = "${id}"`)
            var payload = {data: data[0]}
            console.log("Company retrieved successfully")
            return res.json(payload.data)
        }
        catch(err){
            console.log(err);
            return res.json({message: "error retrieving company", error: err})
        }
    }

    static async addCompany(req, res, connection){
        var com_info = Object.values(req.body)
        try{
            await connection.query('insert into company (com_name, com_phone, com_email, com_address, com_credits) values (?)', [com_info])
            console.log("Company added successfully")
            return res.json({message: "Company added successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error adding company", error: err})
        }
    }

    static async updateCompany(req, res, connection){
        try{
            var com_info = Object.values(req.body)
            await connection.query('update company set com_name=?, com_phone=?, com_email=?, com_address=?, com_credits=? where com_id=?', com_info)
            console.log("Company updated successfully")
            return res.json({message: "Company updated successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error updating company", error: err})
        }
    }

    static async deleteCompany(req, res, connection){
        var id = req.body.id
        try{
            await connection.execute(`delete from company where com_ID= "${id}"`)
            console.log("Company deleted successfully")
            return res.json({message: "Company deleted successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error deleting company", error: err})
        }
    }
}

class AdminEV{
    //fetch all EVs
    static async allEVs(req, res, connection){
        try{
            var data = await connection.execute('select * from EV')
            var payload = {data: data[0]}
            await AdminEV.appendEVBattery(req, res, connection, payload)
            await AdminEV.appendEVPort(req, res, connection, payload, "ev_port")

            data = await connection.execute('select * from EVBattery')
            payload.batteries = data[0]
            data = await connection.execute('select * from Port')
            payload.ports = data[0]

            console.log("All EVs retrieved successfully")
            return res.json(payload)
        }
        catch(err){
            console.log(err);
            return res.json({message: "error retrieving all EVs", error: err})
        }
    }
    static async appendEVBattery(req, res, connection, payload){
        for(let i = 0; i < payload.data.length; i += 1){
            try{
                var id = payload.data[i].bat_id
                var data = await connection.execute(`select * from EVBattery where bat_id = "${id}"`)
                payload.data[i].battery = data[0][0]
            }
            catch(err){
                console.log(err);
                return res.json({message: "error appending battery to evs", error: err})
            }
        }
    }
    static async appendEVPort(req, res, connection, payload, port_name){
        for(let i = 0; i < payload.data.length; i += 1){
            try{
                var id = payload.data[i][port_name]
                var data = await connection.execute(`select * from Port where port_id = "${id}"`)
                payload.data[i][port_name] = data[0][0]
            }
            catch(err){
                console.log(err);
                return res.json({message: "error appending battery to evs", error: err})
            }
        }
    }

    //fetch specific EV
    static async ev(req, res, connection){
        var id = req.query.id
        try{
            var data = await connection.execute(`select * from EV where ev_id = "${id}"`)
            var payload = {data: data[0]}
            console.log("EV retrieved successfully")
            return res.json(payload.data)
        }
        catch(err){
            console.log(err);
            return res.json({message: "error retrieving EV", error: err})
        }
    }

    static async addEV(req, res, connection){
        var ev_info = Object.values(req.body)
        try{
            await connection.query('insert into EV (ev_name, ev_model, ev_company, ev_type, ev_mileage, ev_port, bat_id) values (?)', [ev_info])
            console.log("EV added successfully")
            return res.json({message: "EV added successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error adding EV", error: err})
        }
    }

    static async updateEV(req, res, connection){
        try{
            var ev_info = Object.values(req.body)
            await connection.query('update EV set ev_name=?, ev_model=?, ev_company=?, ev_type=?, ev_mileage=?, ev_port=?, bat_id=? where ev_id=?', ev_info)
            console.log("EV updated successfully")
            return res.json({message: "EV updated successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error updating EV", error: err})
        }
    }

    static async deleteEV(req, res, connection){
        var id = req.body.id
        try{
            await connection.execute(`delete from EV where ev_ID= "${id}"`)
            console.log("EV deleted successfully")
            return res.json({message: "EV deleted successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error deleting EV", error: err})
        }
    }
}

class AdminEVSE{
    //fetch all EVSEs
    static async allEVSEs(req, res, connection){
        try{
            var data = await connection.execute('select * from EVSE')
            var payload = {data: data[0]}
            await AdminEV.appendEVPort(req, res, connection, payload, "evse_port1")
            await AdminEV.appendEVPort(req, res, connection, payload, "evse_port2")

            data = await connection.execute('select * from Port')
            payload.ports = data[0]
            console.log("All EVSEs retrieved successfully")
            return res.json(payload)
        }
        catch(err){
            console.log(err);
            return res.json({message: "error retrieving all EVSEs", error: err})
        }
    }

    //fetch specific EVSE
    static async evse(req, res, connection){
        var id = req.query.id
        try{
            var data = await connection.execute(`select * from EVSE where evse_id = "${id}"`)
            var payload = {data: data[0]}
            console.log("EVSE retrieved successfully")
            return res.json(payload.data)
        }
        catch(err){
            console.log(err);
            return res.json({message: "error retrieving EVSE", error: err})
        }
    }

    static async addEVSE(req, res, connection){
        var evse_info = Object.values(req.body)
        try{
            await connection.query('insert into EVSE (evse_name, evse_model, evse_company, evse_port1, evse_port2) values (?)', [evse_info])
            console.log("EVSE added successfully")
            return res.json({message: "EVSE added successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error adding EVSE", error: err})
        }
    }

    static async updateEVSE(req, res, connection){
        try{
            var evse_info = Object.values(req.body)
            await connection.query('update EVSE set evse_name=?, evse_model=?, evse_company=?, evse_port1=?, evse_port2=? where evse_id=?', evse_info)
            console.log("EVSE updated successfully")
            return res.json({message: "EVSE updated successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error updating EVSE", error: err})
        }
    }

    static async deleteEVSE(req, res, connection){
        var id = req.body.id
        try{
            await connection.execute(`delete from EVSE where evse_ID= "${id}"`)
            console.log("EVSE deleted successfully")
            return res.json({message: "EVSE deleted successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error deleting EVSE", error: err})
        }
    }
}


module.exports = { AdminGrid, AdminUser, AdminCompany, AdminEV, AdminEVSE }