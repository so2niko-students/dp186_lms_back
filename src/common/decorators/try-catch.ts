function TryCatch(target: any, propName: string, descriptor: PropertyDescriptor) {
    const fn = descriptor.value;
    descriptor.value = async (...args) => {
        try {
            await fn.apply(this, args);
        } catch (e) {
            const [, , next] = args;
            next(e);
        }
    };
}

export default TryCatch;