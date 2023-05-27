import * as Bluebird from 'bluebird';

import { Taxonomy } from '../controllers/types';
import SurfLineController from '../provider';

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const persistSpot = async (spot: Taxonomy) => {
  try {
    const existingSpot = await prisma.location.findUnique({
      where: { type_external_spot_id: {
        external_spot_id: spot.spot,
        type: spot.type
      } },
    });

    if (!existingSpot) {
      const createdSpot = await prisma.location.create({
        data: {
          name: spot.name,
          type: spot.type,
          external_spot_id: spot.spot,
          external_id: spot._id,
        },
      });

      console.log(`Spot "${createdSpot.name}" persisted successfully.`);
    } else {
      console.log(`Spot "${existingSpot.name}" already exists. Skipping persist.`);
    }
  } catch (error) {
    console.error('Error occurred while persisting spot:', error);
  }
};

const persistSpots = async (spots: Taxonomy[]) => {
  for (const spot of spots) {
    await persistSpot(spot);
  }
};

const getRegion = async (region: string | undefined) => {
  if (!region) return [];
  const taxonomy = await SurfLineController.taxonomy.get(region);
  return taxonomy.contains;
}

const getSpots = async (region: string | undefined): Promise<Taxonomy[]> => {
  if (!region) return [];

  const taxonomy = await SurfLineController.taxonomy.get(region);
  const spots: Taxonomy[] = [];
  const processedSpots: Set<string> = new Set();

  console.log('Getting Spots......');

  const processLocations = async (locations: Taxonomy[]): Promise<void> => {
    await Bluebird.Promise.map(
      locations,
      async (location: Taxonomy) => {
        console.log('Name: ', location.name);

        if (location?.spot) {
          if (!processedSpots.has(location._id)) {
            console.log('Pushing: ', location.name);
            spots.push(location);
            processedSpots.add(location._id);
          }
        } else if (!location.hasSpots) {
          console.log('No Spots: ', location.name);
        } else {
          console.log('Getting Sub Locations: ', location.name);

          const subLocations = await SurfLineController.taxonomy.get(location._id);
          await processLocations(subLocations.contains);
        }
      },
      { concurrency: 10 } // Specify the concurrency level (e.g., 5 concurrent requests)
    );
  };

  await processLocations(taxonomy.contains);
  return spots;
};


const getLocationByName = async (name: string, locations: Taxonomy[]) => {
  const location = locations.find((location) => location.name === name);
  return location;
}

const getSurfReports = async () => {

  const id = SurfLineController.taxonomy.regions.Earth;
  const spots = await getSpots(id);
  await persistSpots(spots);


  console.log('Spots: ', spots.length)

  
  return spots;
}

getSurfReports();

