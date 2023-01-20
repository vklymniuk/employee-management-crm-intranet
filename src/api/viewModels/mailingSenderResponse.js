function mailingSenderResponse(collection) {
    const result = collection.map((element) => {
      const { user } = element;

      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };

    });

    return result;
}
  
module.exports = { mailingSenderResponse, };