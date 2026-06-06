
class CompanyGrid{
    static async allRequests(req, res, connection){
        var id = req.query.id
        try{
            var data = await connection.execute(`select * from Request where com_id = "${id}"`)
            var payload = {data: [data[0]]}
            data = await connection.execute(`select * from Request where com_id != "${id}" and request_status = "open"`)
            payload.data[1] = data[0]
            data = await connection.execute(`select r.* from request r join RequestResolve rs using (request_id) where rs.response_from = concat('C','${id}')`)
            payload.data[1].push.apply(payload.data[1], data[0])

            data = await connection.execute(`select com_id, com_name from company`)
            payload.data[2] = data[0]
            data = await connection.execute(`select station_id, station_location from station`)
            payload.data[3] = data[0]
            console.log('requests retrieved successfully')
            return res.json(payload.data)
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error retrieving requests', error: err})
        }
    }

    static async addRequest(req, res, connection){
        try{
            req.body.request_time = new Date().toJSON().slice(0, 19).replace('T', ' ')
            req.body.request_status = "open"
            var request_info = Object.values(req.body)

            await connection.query('insert into Request (com_id, station_id, request_time, request_status, curr_station_supply, requested_supply) values (?)', [request_info])
            console.log("request added successfully")
            return res.json({message: "request added successfully"})
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error adding request', error: err})
        }
    }

    static async updateRequest(req, res, connection){
        try{
            req.body.request_time = new Date().toJSON().slice(0, 19).replace('T', ' ')
            var request_info = Object.values(req.body)

            await connection.query('update Request set com_id = ? , station_id = ?, request_time = ?, request_status = ?, curr_station_supply = ?, requested_supply = ? where request_id = ?', request_info)
            console.log("request updated successfully")
            return res.json({message: "request updated successfully"})
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error updating request', error: err})
        }
    }

    static async deleteRequest(req, res, connection){
        var id = req.body.id
        try{
            await connection.execute(`update request set request_status = "canceled" where request_id = "${id}"`)
            console.log("request cancelled successfully")
            return res.json({message: "request cancelled successfully"})
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error cancelling request', error: err})
        }
    }

    static async acceptRequest(req, res, connection){
        var id = req.body.request_id
        try{
            req.body.response_time = new Date().toJSON().slice(0, 19).replace('T', ' ')
            var resolve_info = Object.values(req.body)

            await connection.execute(`update request set request_status = "accepted" where request_id = "${id}"`)
            await connection.query('insert into RequestResolve (request_id, response_from, response_time, response_supply, slot_from, slot_to) values (?)', [resolve_info])
            console.log("request accepted successfully")
            return res.json({message: "request accepted successfully"})
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error accepting request', error: err})
        }
    }

    static async completeRequest(req, res, connection){
        var id = req.body.id
        try{
            await connection.execute(`update request set request_status = "completed" where request_id = "${id}"`)
            console.log("request completed successfully")
            return res.json({message: "request completed successfully"})
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error completing request', error: err})
        }
    }

}

module.exports = { CompanyGrid }