import * as Bluebird from 'bluebird';

import {
  Geonames,
  Taxonomy,
} from '../controllers/types';
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
      const data =  {
        name: spot.name,
        type: spot.type,
        external_spot_id: spot.spot,
        external_id: spot._id,
        country: spot?.parent?.countryCode,
        state:  spot?.parent?.adminCode1,
        city:  spot?.parent?.name,
      };
      console.log(data)
      const createdSpot = await prisma.location.create({
        data: {
          name: spot.name,
          type: spot.type,
          external_spot_id: spot.spot,
          external_id: spot._id,
          country: spot?.parent?.countryCode,
          state:  spot?.parent?.adminCode1,
          city:  spot?.parent?.name,
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

  const processLocations = async (locations: Taxonomy[], parent: Geonames | null = null, recursion = 3): Promise<void> => {
    await Bluebird.Promise.map(
      locations,
      async (location: Taxonomy) => {
        console.log('Name: ', location.name);

        if (location?.spot) {
          const spot = spots.find(spot => spot._id === location._id);
          if (!spot) {
            console.log('Pushing: ', location.name);
            if (parent && parent.fcode === 'PPL') {
              location.parent = parent;
            }
            // 
            spots.push(location);
            processedSpots.add(location._id);
          } else {
            // just update the location parent if it's not set in spots
            
            if (spot && spot?.parent?.fcode !== 'PPL' && parent) {
              spot.parent = parent;
            }
          }
        } else if (!location.hasSpots) {
          console.log('No Spots: ', location.name);
        } else {
          console.log('Getting Sub Locations: ', location.name);

          const subLocations = await SurfLineController.taxonomy.get(location._id, 1);
          if (location.name == 'Seybouse' || location.name == 'Las Rosas') {
            return
          }
          await processLocations(subLocations.contains, subLocations.geonames, recursion + 1);
        }
      },
      { concurrency: recursion } // Specify the concurrency level (e.g., 5 concurrent requests)
    );
  };

  await processLocations(taxonomy.contains);
  return spots;
};


const getSurfReports = async () => {
  const regionArg = process.argv[2]; // Get the command-line argument for region

  let regionId;
  switch (regionArg) {
    case 'Earth':
      regionId = SurfLineController.taxonomy.regions.Earth;
      break;
    case 'NorthAmerica':
      regionId = SurfLineController.taxonomy.regions.NorthAmerica;
      break;
    case 'ElSalvador':
      regionId = SurfLineController.taxonomy.regions.ElSalvador;
      break;
    case 'CostaRica':
      regionId = SurfLineController.taxonomy.regions.CostaRica;
      break;
    case 'Mexico':
      regionId = SurfLineController.taxonomy.regions.Mexico;
      break;
    case 'UnitedStates':
      regionId = SurfLineController.taxonomy.regions.UnitedStates;
      break;
    case 'Brazil':
      regionId = SurfLineController.taxonomy.regions.Brazil;
      break;
    default:
      regionId = SurfLineController.taxonomy.regions.NorthAmerica;
  }

  const spots = await getSpots(regionId);
  await persistSpots(spots);
  console.log('Spots:', spots.length);
};

getSurfReports();

