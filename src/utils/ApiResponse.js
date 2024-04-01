class ApiResponse{
    constructor(message="Success", statusCode, data){
        this.message = message
        this.statusCode = statusCode
        this.data = data
        this.success = this.statusCode < 400
    }
}

export default ApiResponse