function createErrorResponse() {
    return {
        success: false,
        message: "request is not completed successfully",
        data: {},
        error: {},
    };
}

module.exports = createErrorResponse;