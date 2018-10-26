export const PacketHandler = function(constructor: Function) {
    const oldConstructor = constructor;
    console.log(oldConstructor);
    // 重写constructor
    constructor = function () {
        const args = arguments;
        console.log(this);
        oldConstructor.apply(this, args);
    };
};
