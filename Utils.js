
class Reports{
    static async allReports(req, res, connection){
        try{
            var data = await connection.execute('select * from Reports')
            var payload = {data: data[0]}
            console.log("All reports retrieved successfully")
            return res.json(payload.data)
        }
        catch(err){
            console.log(err);
            return res.json({message: "error retrieving all reports", error: err})
        }
    }

    static async addReport(req, res, connection){
        try{
            req.body.report_time = new Date().toJSON().slice(0, 19).replace('T', ' ')
            req.body.report_status = 'submitted'
            var report_info = Object.values(req.body)

            await connection.query('insert into Reports (report_from, report_time, report_status, report_description) values (?)', [report_info])
            console.log("report submitted successfully")
            return res.json({message: "report submitted successfully"})
        }
        catch(err){
            console.log(err)
            return res.json({message: 'error submitting report', error: err})
        }
    }

    static async updateReport(req, res, connection){
        var id = req.body.id
        try{
            await connection.execute(`update Reports set report_status = "acknowledged" where report_id = "${id}"`)
            console.log("report updated successfully")
            return res.json({message: "report updated successfully"})
        }
        catch(err){
            console.log(err);
            return res.json({message: "error updating report", error: err})
        }
    }
}

module.exports = { Reports }