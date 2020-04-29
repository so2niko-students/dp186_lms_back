function Catcher(f) {
    return (req, res, next) => {
        try {
            f.apply(this, [req, res, next]);
        } catch (e) {
            next();
        }
    };
}

export default Catcher;
