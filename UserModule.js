
class UserBooking{
    //all user bookings
    static async allBookings(req, res, connection){
        var id = req.query.id
        try{
            var data = await connection.execute(`select * from booking where user_id = "${id}"`)
            var payload = {data: data[0]}
            await UserBooking.bookingDetails(req, res, connection, payload)
            console.log('bookings retrieved successfully')
            return res.json(payload.data)
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error retrieving bookings', error: err})
        }
    }
    static async bookingDetails(req, res, connection, payload){
        for(let i = 0; i < payload.data.length; i += 1){
          try{
              //append slot timings
              var id = payload.data[i].slot_from
              var from = await connection.execute(`select from_time from timeslot where slot_id = "${id}"`)
              id = payload.data[i].slot_to
              var to = await connection.execute(`select to_time from timeslot where slot_id = "${id}"`)
              payload.data[i].time = from[0][0].from_time + " - " + to[0][0].to_time

              //append station and user ev details
              id = payload.data[i].station_evse_id
              var data = await connection.execute(`select station_location from station where station_id = (select station_id from stationevse where station_evse_id = "${id}")`)
              payload.data[i].station_location = data[0][0].station_location
              id = payload.data[i].user_ev_id
              data = await connection.execute(`select registration_no from userev where user_ev_id = "${id}"`)
              payload.data[i].registration_no = data[0][0].registration_no
          }
          catch(err){
            console.log(err)
            return payload.res.json({message: 'error retrieving time slot', error: err})
          }
        }
    }

    static async stationNames(req, res, connection){
        try{
            var data = await connection.execute('select station_id, station_location from station')
            var payload = {data: data[0]}
            await UserBooking.statinEVSEId(req, res, connection, payload)
            console.log('station names retrieved successfully')
            return res.json(payload.data)
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error retrieving station names', error: err})
        }
    }
    static async statinEVSEId(req, res, connection, payload){
        for(let i = 0; i < payload.data.length; i += 1){
            try{
              var id = payload.data[i].station_id
              var data = await connection.execute(`select station_evse_id from stationEVSE where station_id = "${id}"`)
              payload.data[i].station_evses = data[0]
            }
            catch(err){
              console.log(err)
              return res.json({message: 'error retrieving station evses', error: err})
            }
        }
    }

    static async timeSlots(req, res, connection){
        try{
            var data = await connection.execute('select * from timeslot')
            console.log('time slots retrieved successfully')
            return res.json(data[0])
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error retrieving time slots', error: err})
        }
    }

    //selected user booking
    static async booking(req, res ,connection){
        var id = req.query.id
        try{
            var data = await connection.execute(`select * from booking where booking_id = "${id}"`)
            id = data[0][0].station_evse_id
            var station = await connection.execute(`select station_id, station_location from station where station_id = (select station_id from stationEVSE where station_evse_id = "${id}")`)
            data[0][0].station = station[0][0]
            console.log('booking retrieved successfully')
            return res.json(data[0])
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error retrieving booking', error: err})
        }
    }

    //add new user booking
    static async addBooking(req, res ,connection){
        try{
            req.body.transaction_id = "T" + Math.floor(Math.random() * 9999)
            req.body.booking_time = new Date().toJSON().slice(0, 19).replace('T', ' ')
            req.body.booking_status = "confirmed"
            var booking_info = Object.values(req.body)

            await connection.query('insert into Booking (user_id, user_ev_id, station_evse_id, booking_status, booking_time, slot_from, slot_to, transaction_id, user_bat_charge, user_location) values (?)', [booking_info])
            console.log("booking added successfully")
            return res.json({message: "booking added successfully"})
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error adding booking', error: err})
        }
    }

    //update user booking
    static async updateBooking(req, res ,connection){
        try{
            req.body.booking_time = new Date().toJSON().slice(0, 19).replace('T', ' ')
            req.body.booking_status = "updated"
            var booking_info = Object.values(req.body)

            await connection.query('update Booking set user_id = ?, user_ev_id = ?, station_evse_id = ?, booking_status = ?, booking_time = ?, slot_from = ?, slot_to = ?, transaction_id = ?, user_bat_charge = ?, user_location = ? where booking_id = ?', booking_info)
            console.log("booking updated successfully")
            return res.json({message: "booking updated successfully"})
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error updating booking', error: err})
        }
    }

    //delete user booking
    static async deleteBooking(req, res, connection){
        var id = req.body.id
        try{
            await connection.execute(`update Booking set booking_status = "canceled" where booking_id = "${id}"`)
            console.log("booking cancelled successfully")
            return res.json({message: "booking cancelled successfully"})
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error deleting booking', error: err})
        }
    }

    //complete user booking
    static async completeBooking(req, res, connection){
        var id = req.body.id
        try{
            await connection.execute(`update Booking set booking_status = "completed" where booking_id = "${id}"`)
            console.log("booking completed successfully")
            return res.json({message: "booking completed successfully"})
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error completing booking', error: err})
        }
    }
}

class UserEV{
    static async userEVs(req, res, connection){
        var id = req.query.id
        try{
            var data = await connection.execute(`select * from UserEV where user_id = "${id}"`)
            var payload = {data: data[0]}
            await UserEV.appendUserEV(req, res, connection, payload)
            console.log('evs retrieved successfully')
            return res.json(payload.data)
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error retrieving user evs', error: err})
        }
    }
    static async appendUserEV(req, res, connection, payload){
        for(let i = 0; i < payload.data.length; i += 1){
            try{
                var id = payload.data[i].ev_id
                var data = await connection.execute(`select * from EV where ev_id = "${id}"`)
                payload.data[i].ev = data[0][0]
                id = payload.data[i].ev.ev_port
                data = await connection.execute(`select port_name from Port where port_id = "${id}"`)
                payload.data[i].ev.ev_port = data[0][0].port_name
                id = payload.data[i].ev.bat_id
                data = await connection.execute(`select bat_name from EVBattery where bat_id = "${id}"`)
                payload.data[i].ev.battery = data[0][0].bat_name
            }
            catch(err){
                console.log(err)
                return res.json({message: 'error appending ev', error: err})
            }
        }
    }
}

class UserBattery{
    static async userEVBatteries(req, res, connection){
        var id = req.query.id
        try{
            var data = await connection.execute(`select user_ev_id, registration_no, ev_id, user_ev_bat_id from UserEV where user_id = "${id}"`)
            var payload = {data: data[0]}
            await UserBattery.appendUserEVBattery(req, res, connection, payload)
            console.log('user batteries retrieved successfully')
            return res.json(payload.data)
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error retrieving user ev batteries', error: err})
        }
    }
    static async appendUserEVBattery(req, res, connection, payload){
        for(let i = 0; i < payload.data.length; i += 1){
            try{
                var id = payload.data[i].ev_id
                var data = await connection.execute(`select * from EVbattery where bat_id = (select bat_id from EV where ev_id = "${id}")`)
                payload.data[i].battery = data[0][0]
                id = payload.data[i].user_ev_bat_id
                data = await connection.execute(`select * from UserEVBattery where user_ev_bat_id = "${id}"`)
                payload.data[i].user_battery = data[0][0]
            }
            catch(err){
                console.log(err)
                return res.json({message: 'error appending user ev batteries', error: err})
            }
        }
    }
}

module.exports = { UserBooking, UserEV, UserBattery }