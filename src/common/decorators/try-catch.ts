function handleRequest(f) {
    return (req, res, next) => {
        try {
            f.apply(this, [req, res, next]);
        } catch (e) {
            next(e);
        }
    };
}

export default handleRequest;
