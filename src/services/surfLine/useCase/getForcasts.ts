import SurfLineController from '../provider';

const getSurfReports = async () => {
  const spotId = process.argv[2]; // Get the command-line argument for region

  if (!spotId) {
    console.error('Please provide a spot ID.');
    return;
  }

  // get todays date but 10 years ago
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 13);
  const startDateString = startDate.toISOString().split('T')[0];

  // loop through every 16 days and get the forcast until you reach today

  // get the forcast
  while (startDate < new Date()) {
    const startDateString = startDate.toISOString().split('T')[0];
    console.log('startDateString', startDateString)
    await SurfLineController.forcast.getForcastByDate(spotId, startDateString);
    startDate.setDate(startDate.getDate() + 17);
  }


  
  
  // persist the forcast
  //persistForcast(forcast);

};

getSurfReports();

