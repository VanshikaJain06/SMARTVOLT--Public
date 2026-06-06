
class Login{
    //login authentication
    static async auth(req, res, connection){
        var email = req.query.email
        try{
            if(email == 'ashwin.kumar@mca.christuniversity.in'){
                data = [{
                    admin_name: 'Admin',
                    admin_email: 'ashwin.kumar@mca.christuniversity.in'
                }]
                console.log('admin logged in')
                return res.json({access: 'admin', body: data})
            }
            var data = await connection.execute(`select * from user where user_email = "${email}"`)
            if(data[0][0] == null){
                data = await connection.execute(`select * from company where com_email = "${email}"`)
                if(data[0][0] == null){
                    console.log('user needs to register')
                    return res.json({access: 'register', body: ''})
                }
                console.log('company logged in')
                return res.json({access: 'company', body: data[0]})
            }
            console.log('user logged in')
            return res.json({access: 'user', body: data[0]})
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error authenticating user', error: err})
        }
    }

    //user registration
    static async register(req, res, connection){
        var table = req.body.access
        var user_info = Object.values(req.body.data)

        if(table == 'user')
            var sql = `insert into User (user_firstname, user_lastname, user_phone, user_email, user_address, user_DOB, user_credits, user_license) values (?)`
        else
            var sql = `insert into Company (com_name, com_phone, com_email, com_address, com_credits) values (?)`

        try{
            await connection.query(sql, [user_info])
            console.log('user registered successfully')
            return res.json({message: 'user registered successfully'})
        }
        catch(err){
            console.log(err)
            return res.status(500).json({message: 'error registering user', error: err})
        }
    }

    //login auth with stored procedure ---(WARNING: This method has unresolved bugs!)
    static async auth1(req, res, connection){
        let email = req.query.email
        try{
            var data = await connection.execute(`call CheckUserAccess("${email}", @access)`)
            var access = await connection.execute('select @access')
            access = Object.values(access)[0][0]['@access']
            console.log(email + " " +access)
            data = data[0][0]

            if(access == "admin"){
                data = [{
                    admin_name: 'Admin',
                    admin_email: 'ashwin.kumar@mca.christuniversity.in'
                }]
                console.log('admin logged in')
                return res.json({access: access, body: data})
            }
            else if(access == "user"){
                console.log('user logged in')
                return res.json({access: access, body: data})
            }
            else if(access == "company"){
                console.log('company logged in')
                return res.json({access: access, body: data})
            }
            else if(access == "register"){
                console.log('user needs to register')
                return res.json({access: access, body: ''})
            }
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error authenticating user', error: err})
        }
    }

    
}

class Dashboard{
    //user dashboard
    static async userEV(req, res, connection){
        var id = req.query.id
        try{
            var data = await connection.execute(`select * from userEV where user_id = "${id}"`)
            var payload = {data: data[0]}
            await Dashboard.userEVBattery(req, res, connection, payload)
            console.log('userEV retrieved successfully')
            return res.json(payload.data)
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error retrieving user ev', error: err})
        }
    }
    static async userEVBattery(req, res, connection, payload){
        for(let i = 0; i < payload.data.length; i += 1){
            try{
                var id = payload.data[i].user_ev_bat_id
                var data = await connection.execute(`select * from userEVBattery where user_ev_bat_id = "${id}"`)
                payload.data[i].battery = data[0][0]
            }
            catch(err){
              console.log(err)
              return res.json({message: 'error retrieving user ev battery', error: err})
            }
        }
    }

    //company dashboard
    static async companyStation(req, res, connection){
        var id = req.query.id
        try{
            var data = await connection.execute(`select * from station where com_id = "${id}"`)
            var payload = {data: data[0]}
            await Dashboard.stationEVSE(req, res, connection, payload)
            console.log('companyStation retrieved successfully')
            return res.json(payload.data)
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error retrieving stations', error: err})
        }
    }
    static async stationEVSE(req, res, connection, payload){
        for(let i = 0; i < payload.data.length; i += 1){
            try{
                var id = payload.data[i].station_id
                var data = await connection.execute(`select * from stationEVSE where station_id = "${id}"`)
                payload.data[i].station_evse = data[0]
                await Dashboard.EVSE(req, res, connection, payload, i)
            }
            catch(err){
              console.log(err)
              return payload.res.json({message: 'error retrieving station evse', error: err})
            }
        }
    }
    static async EVSE(req, res, connection, payload, x){
        for(let i = 0; i < payload.data[x].station_evse.length; i += 1){
            try{
                var id = payload.data[x].station_evse[i].evse_id
                var data = await connection.execute(`select * from EVSE where evse_id = "${id}"`)
                payload.data[x].station_evse[i].evse = data[0][0]
                payload.data[x].station_evse[i].evse.evse_port1 = await Dashboard.Port(req, res, connection, data[0][0].evse_port1)
                payload.data[x].station_evse[i].evse.evse_port2 = await Dashboard.Port(req, res, connection, data[0][0].evse_port2)
            }
            catch(err){
              console.log(err)
              return payload.res.json({message: 'error retrieving evse', error: err})
            }
        }
    }
    static async Port(req, res, connection, id){
        try{
            var data = await connection.execute(`select * from Port where port_id = "${id}"`)
            return data[0][0]
        }
        catch(err){
          console.log(err)
          return res.json({message: 'error retrieving port', error: err})
        }
    }

    //admin dashboard
    static async adminStation(req, res, connection){
        try{
            var data = await connection.execute(`select * from station`)
            var payload = {data: data[0]}
            await Dashboard.stationEVSE(req, res, connection, payload)
            console.log('adminStation retrieved successfully')
            return res.json(payload.data)
        }
        catch(err){
          console.log(err)
          return payload.res.json({message: 'error retrieving stations', error: err.err})
        }
    }
}

module.exports = { Login, Dashboard }