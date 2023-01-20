async function getHolidayResponse(holiday) {
    const result = holiday.toJSON();
  
    if (result.availableIn) {
      result.availableIn = result.availableIn.map((i) => ({
        locationId: i.id,
        location: {
          id: i.id,
          title: i.title,
        },
      }));
    }
  
    return result;
}

async function getHolidayResponses(holidays) {
  return Promise.all(holidays.map((holiday) => getHolidayResponse(holiday)));
}
  
module.exports = { getHolidayResponses, getHolidayResponse, };  