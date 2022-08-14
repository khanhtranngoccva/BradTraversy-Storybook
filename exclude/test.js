async function oof() {
    try {
        const promise = new Promise((resolve, reject) => {
            reject(new Error("oof."));
        });
    } catch (e) {

    }

}

oof();