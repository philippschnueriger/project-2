import { TripSummary } from './tripSummary';

function findIndexByFlyTo(data: any) {
  for (let i = 0; i < data.route.length; i++) {
    if (data.route[i].flyTo === data.flyTo) {
      return i;
    }
  }
  return -1;
}

function getOperators(data: any) {
  const allOperators = data.map((data: any) => data.operating_carrier);
  const uniqueOperators = [...new Set(allOperators)];
  return uniqueOperators.join(', ');
}

function getDuration(duration: any) {
  if (duration === undefined) {
    return '';
  }
  let hours = Math.floor(duration / 3600);
  let minutes = Math.floor((duration % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

export function getTripSummary(item: any) {
  let tripSummary: TripSummary = {
    operators: getOperators(item.route),
    departure: {
      from: item.flyFrom,
      to: item.flyTo,
      departureTime: item.local_departure || '',
      arrivalTime: item.local_arrival || '',
      stops: findIndexByFlyTo(item),
      duration: getDuration(item.duration.departure),
    },
  };
  if (item.duration.return > 0) {
    tripSummary.return = {
      from: item.flyTo,
      to: item.flyFrom,
      departureTime:
        item.route?.[findIndexByFlyTo(item) + 1].local_departure || '',
      arrivalTime: item.route?.[item.route?.length - 1].local_arrival || '',
      stops: (item.route?.length || 0) - findIndexByFlyTo(item) - 2,
      duration: getDuration(item.duration.return),
    };
  }
  return tripSummary;
}
