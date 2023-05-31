module.exports = (token) => {
    const validToken = [5, 10, 15, 20];
    validToken.forEach((value) => {
        if (value == token) return true;
    });
    return false;
};

//This will our our main purchase system
