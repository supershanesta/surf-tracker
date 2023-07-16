import csv from 'csv-parser';
import fs from 'fs';

import { CreateSurfActivityInputType } from '@/types/api';
import { User } from '@prisma/client';

import LocationProvider from '../providers/Location';
import SurfActivity from '../providers/SurfActivity';
import UserProvider from '../providers/User';

interface Row {
  date: string;
  beach: string;
  persons: string;
  rating: string;
}

// Function to process each row
const processRow = async (row: Row, user: User, surfActivityProvider: SurfActivity) => {
  const { date, beach, persons, rating } = row;

  // Do something with the row data
  console.log(`Date: ${date}`);
  console.log(`Beach: ${beach}`);
  console.log(`Persons: ${persons}`);
  console.log(`Rating: ${rating}`);

  // add dash to date
  const newDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
  // validate date
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(newDate)) {
    throw new Error(`Invalid date: ${newDate}`);
  }
  // get beach id
  const locationProvider = new LocationProvider();
  const beachObject = await locationProvider.getByName(beach);
  if (!beachObject) {
    throw new Error(`Invalid beach: ${beach}`);
  }
  // get persons
  // convert string to array of strings
  let userIds: string[] = [];
  if (persons !== '') {
  
    const personsArray = persons.split(',');
    // get user ids
    const userProvider = new UserProvider();
    userIds = await Promise.all(personsArray.map(async (person) => {
      const user = await userProvider.getByFirstName(person);
      if (!user) {
        throw new Error(`Invalid user: ${person}`);
      }
      return user.id;
    }));
  }
  // set rating
  const ratingNumber = parseInt(rating);
  const newSurfActivity: CreateSurfActivityInputType = {
    date: newDate,
    users: userIds,
    beach: beachObject.id,
    surfRating: {
      rating: ratingNumber,
      size: 1 + ratingNumber,
      shape: ratingNumber,
      notes: '',
    }
  }
  console.log(newSurfActivity)
  // create surf activity
  const surfActivity = await surfActivityProvider.create(newSurfActivity);
  if (!surfActivity) {
    throw new Error(`Error creating surf activity`);
  } else {
    console.log(`Surf activity created: ${surfActivity.id}`);
  }
}

const getUserByFirstName = async (firstName: string) => {
  // get user

  const userProvider = new UserProvider();
  const user = await userProvider.getByFirstName("Mike");
  if (!user) {
    throw new Error(`User ${firstName} not found`);
  }
  // get provider
  const surfActivityProvider = new SurfActivity(user.id);

  return { user, surfActivityProvider };

  
}

const go = async () => {
  const { user, surfActivityProvider } = await getUserByFirstName('Mike');
  const rows: Row[] = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream('./src/prisma/scripts/data.csv')
      .pipe(csv())
      .on('data', (row: Row) => {
        rows.push(row);
      })
      .on('end', () => {
        resolve(undefined);
      })
      .on('error', (error: Error) => {
        reject(error);
      });
  });

  const totalRows = rows.length;
  let processedRows = 0;

  for (const row of rows) {
    try {
      await processRow(row, user, surfActivityProvider);
      processedRows++;
      console.log(`Processed row ${processedRows} of ${totalRows}`);
    } catch (error) {
      console.error('Error processing row:', error);
    }
  }

  console.log('CSV file processed successfully.');
}

  go();