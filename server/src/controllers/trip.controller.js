import { prisma } from '../lib/prisma.js';
import { getOrFetchCityImage } from '../services/pexels.service.js';

export const getUserTrips = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const trips = await prisma.trip.findMany({
      where: {
        userId,
        ...(status && status !== 'all'
          ? {
              startDate:
                status.toLowerCase() === 'completed'
                  ? { lte: new Date() }
                  : { gte: new Date() },
            }
          : {}),
      },
      include: {
        stops: {
          include: {
            city: {
              include: {
                country: true,
                images: { include: { image: true } },
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    const formattedTrips = await Promise.all(
      trips.map(async (trip) => {
        const isCompleted = new Date(trip.endDate) < new Date();

        const firstStop = trip.stops[0]?.city;
        let coverImageUrl = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

        if (firstStop) {
          coverImageUrl =
            firstStop.images?.[0]?.image?.url ||
            (await getOrFetchCityImage(firstStop.id, firstStop.name, firstStop.country?.name));
        }

        const locationSummary = trip.stops.map((s) => s.city.name).join(', ') || 'Custom Destination';

        return {
          id: trip.id,
          name: trip.name,
          description: trip.description || 'Custom planned travel journey.',
          startDate: trip.startDate.toISOString(),
          endDate: trip.endDate.toISOString(),
          formattedDates: `${new Date(trip.startDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })} - ${new Date(trip.endDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}`,
          travelerCount: trip.travelerCount,
          travelerLabel: `${trip.travelerCount} ${trip.travelerCount === 1 ? 'Traveler' : 'Travelers'}`,
          status: isCompleted ? 'COMPLETED' : 'UPCOMING',
          statusLabel: isCompleted ? 'Completed' : 'Upcoming',
          coverImageUrl,
          locationSummary,
          stops: trip.stops.map((s) => ({
            id: s.id,
            cityName: s.city.name,
            countryName: s.city.country.name,
            order: s.order,
          })),
          budget: Number(trip.budget || 0),
          currency: trip.currency,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: formattedTrips,
    });
  } catch (error) {
    next(error);
  }
};

export const createTrip = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, description, startDate, endDate, travelerCount, budget, destinationCityId, customCityName } = req.body;

    let cityRecord = null;

    if (destinationCityId) {
      cityRecord = await prisma.city.findUnique({
        where: { id: Number(destinationCityId) },
        include: { country: true },
      });
    } else if (customCityName) {
      // Find or create default city
      let country = await prisma.country.findFirst();
      if (!country) {
        country = await prisma.country.create({
          data: { name: 'International', code: 'INT', continent: 'World' },
        });
      }

      cityRecord = await prisma.city.create({
        data: {
          countryId: country.id,
          name: customCityName,
          region: 'Global',
          description: 'User custom travel destination',
        },
        include: { country: true },
      });
    } else {
      // Pick top city as default stop
      cityRecord = await prisma.city.findFirst({
        include: { country: true },
      });
    }

    const coverImageUrl = cityRecord
      ? await getOrFetchCityImage(cityRecord.id, cityRecord.name, cityRecord.country?.name)
      : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

    const newTrip = await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.create({
        data: {
          userId,
          name: name || `Trip to ${cityRecord?.name || 'Destination'}`,
          description: description || null,
          startDate: new Date(startDate || Date.now()),
          endDate: new Date(endDate || Date.now() + 7 * 24 * 60 * 60 * 1000),
          travelerCount: Number(travelerCount || 1),
          budget: budget ? Number(budget) : 1500,
          currency: 'USD',
        },
      });

      if (cityRecord) {
        await tx.tripStop.create({
          data: {
            tripId: trip.id,
            cityId: cityRecord.id,
            startDate: trip.startDate,
            endDate: trip.endDate,
            order: 1,
          },
        });
      }

      return trip;
    });

    const isCompleted = new Date(newTrip.endDate) < new Date();

    const formattedCreatedTrip = {
      id: newTrip.id,
      name: newTrip.name,
      description: newTrip.description || 'Custom planned travel journey.',
      startDate: newTrip.startDate.toISOString(),
      endDate: newTrip.endDate.toISOString(),
      formattedDates: `${new Date(newTrip.startDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })} - ${new Date(newTrip.endDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}`,
      travelerCount: newTrip.travelerCount,
      travelerLabel: `${newTrip.travelerCount} ${newTrip.travelerCount === 1 ? 'Traveler' : 'Travelers'}`,
      status: isCompleted ? 'COMPLETED' : 'UPCOMING',
      statusLabel: isCompleted ? 'Completed' : 'Upcoming',
      coverImageUrl,
      locationSummary: cityRecord ? cityRecord.name : 'Custom Destination',
      stops: cityRecord
        ? [
            {
              id: 1,
              cityName: cityRecord.name,
              countryName: cityRecord.country.name,
              order: 1,
            },
          ]
        : [],
      budget: Number(newTrip.budget || 0),
      currency: newTrip.currency,
    };

    res.status(201).json({
      success: true,
      data: formattedCreatedTrip,
    });
  } catch (error) {
    next(error);
  }
};
