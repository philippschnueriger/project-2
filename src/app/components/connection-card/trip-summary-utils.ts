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

function calculateLegDuration (route: any) {
  for (let i = 0; i < route.length; i++) {
    let arrivalTime = new Date(route[i].local_arrival).getTime();
    let departureTime = new Date(route[i].local_departure).getTime();
    let legDuration = getDuration((arrivalTime - departureTime)/1000);
    route[i].duration = legDuration;
  }
  return route;
}

function getDuration(duration: any) {
  if (duration === undefined) {
    return '';
  }
  let hours = Math.floor(duration / 3600);
  let minutes = Math.floor((duration % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function calculateLayoverTime(route: any) {

  for (let i = 0; i < route.length - 1; i++) {
    let arrivalTime = new Date(route[i].local_arrival).getTime();
    let departureTime = new Date(route[i+1].local_departure).getTime();
    let layover = departureTime - arrivalTime;
    let layoverHours = Math.floor((layover / (1000 * 60 * 60)) % 24);
    let layoverMinutes = Math.floor((layover / (1000 * 60)) % 60);
    route[i].layover = `${layoverHours}h ${layoverMinutes}m`
  }
  return route;
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
      route: item.route.slice(0,  findIndexByFlyTo(item)+1),
      operators: "",
    },
  };
  tripSummary.departure.operators = getOperators(tripSummary.departure.route);
  tripSummary.departure.route = calculateLayoverTime(tripSummary.departure.route);
  tripSummary.departure.route = calculateLegDuration(tripSummary.departure.route)

  if (item.duration.return > 0) {
    tripSummary.return = {
      from: item.flyTo,
      to: item.flyFrom,
      departureTime:
        item.route?.[findIndexByFlyTo(item) + 1].local_departure || '',
      arrivalTime: item.route?.[item.route?.length - 1].local_arrival || '',
      stops: (item.route?.length || 0) - findIndexByFlyTo(item) - 2,
      duration: getDuration(item.duration.return),
      route: item.route.slice(findIndexByFlyTo(item)+1),
      operators: "",
    };
    tripSummary.return.operators = getOperators(tripSummary.return.route);
    tripSummary.return.route = calculateLayoverTime(tripSummary.return.route);
    tripSummary.return.route = calculateLegDuration(tripSummary.return.route)
  }
  
  return tripSummary;
}
